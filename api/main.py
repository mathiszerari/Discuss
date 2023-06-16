from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.uri_parser import parse_uri
from dotenv import load_dotenv, find_dotenv
import logging
import os
import re
import bcrypt
from bson import ObjectId
from pymongo.server_api import ServerApi

load_dotenv(find_dotenv())

password = os.environ.get("MONGO_PWD")


# connection_string = f"mongodb://127.0.0.1/discuss"
connection_string = "mongodb+srv://mathis:buvyg1mIoxULoFlP@discuss.8rkcwju.mongodb.net/?retryWrites=true&w=majority"

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

client = MongoClient(connection_string, server_api=ServerApi('1'))
db = client.discuss
collection_users = db.usersdatas
collection_responses = db.responses


@app.route("/api/getresponses", methods=["GET"])
def get_responses():
    algorithm = request.args.get("algorithm")
    responses = []

    for response in collection_responses.find():
        username = response["username"]
        users = collection_users.find({"username": username})
        for user in users:
            response_data = {"username": user["username"], "reply": response["reply"]}
            if "index" in response:
                response_data["index"] = response["index"]
            if "score" in response:
                response_data["score"] = response["score"]
            if "heure" in response:
                response_data["heure"] = response["heure"]
            if "upvote" in response:
                response_data["upvote"] = response["upvote"]
            if "downvote" in response:
                response_data["downvote"] = response["downvote"]
            responses.append(response_data)

    if algorithm == "relevant":
        responses.sort(key=lambda x: x.get("score", 0), reverse=True)
    elif algorithm == "recent":
        responses.sort(key=lambda x: x.get("heure", datetime.min), reverse=True)

    return jsonify(responses)


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email_or_username = data[
        "emailOrUsername"
    ].lower()  # Modifier le nom de la clé pour correspondre à la valeur du champ unique
    password = data["password"]

    existing_user = collection_users.find_one(
        {"$or": [{"email": email_or_username}, {"username": email_or_username}]}
    )  # Utiliser la même logique pour vérifier email ou username
    if not existing_user:
        app.logger.error("Utilisateur introuvable")
        return jsonify(
            {"message": "Utilisateur non trouvé"}
        )  # Modifier le message d'erreur si l'utilisateur n'existe pas

    hashed_password = existing_user["password"]

    if not bcrypt.checkpw(password.encode("utf-8"), hashed_password):
        app.logger.error("Mot de passe incorrect")
        return jsonify({"message": "Mot de passe incorrect"})

    # Ici, vous pouvez générer le jeton JWT

    return jsonify({"message": "Authentification réussie"})


regex = re.compile(r"([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+")
regex_username = re.compile(r"^[a-zA-Z0-9_]{1,15}$")
regex_password = re.compile(
    r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
)


@app.route("/api/users", methods=["POST"])
def create_users():
    data = request.get_json()
    username = data["username"].lower()
    email = data["email"].lower()
    password = data["password"]

    # Conditions de validation
    if username == "" or email == "" or password == "":
        app.logger.error("Champ(s) invalide(s)")
        return jsonify({"message": "Champ(s) invalide(s)"})

    if not re.match( password):
        app.logger.error("Le mot de passe ne respecte pas les critères de sécurité")
        return jsonify(
            {"message": "Le mot de passe ne respecte pas les critères de sécurité"}
        )

    salt = bcrypt.gensalt()
    password = bcrypt.hashpw(password.encode("utf-8"), salt)

    if not re.fullmatch(regex_username, username):
        app.logger.error("Username invalide")
        return jsonify({"message": "Username invalide"})

    if not re.fullmatch(regex, email):
        app.logger.error("Email invalide")
        return jsonify({"message": "Email invalide"})

    existing_user = collection_users.find_one({"username": username})

    if existing_user:
        app.logger.error("Le nom d'utilisateur est déjà pris")
        return jsonify({"message": "Le nom d'utilisateur est déjà pris"})

    existing_email = collection_users.find_one({"email": email})

    if existing_email:
        app.logger.error("L'email est déjà pris")
        return jsonify({"message": "L'email est déjà pris"})

    # Insérer le nouvel utilisateur dans la base de données
    user_data = {"username": username, "email": email, "password": password}

    collection_users.insert_one(user_data)

    return jsonify({"message": "Utilisateur créé avec succès"})


@app.route("/api/response", methods=["POST"])
def response():
    data = request.get_json()
    username = data["username"]
    reply = data["reply"]
    upvote = data["upvote"]
    downvote = data["downvote"]
    question = data["question"]
    score = data["score"]
    heure_actuelle = datetime.now()

    user = collection_users.find_one({"username": username})
    if not user:
        app.logger.error("Utilisateur non trouvé")
        return jsonify({"message": "Utilisateur non trouvé"})

    user_id = str(user["_id"])

    total_responses = collection_responses.count_documents(
        {}
    )  # Nombre total de réponses dans la collection
    index = total_responses  # Nouvelle valeur de l'index pour la réponse actuelle

    responses = {
        "question": question,
        "user_id": user_id,
        "username": username,
        "reply": reply,
        "upvote": upvote,
        "downvote": downvote,
        "heure": heure_actuelle,
        "index": index,
        "score": score,
    }
    response = collection_responses.insert_one(responses)

    # Après l'insertion de la réponse dans la base de données
    response_id = str(response.inserted_id)
    responses["_id"] = response_id

    return jsonify(
        {
            "message": "Réponse enregistrée avec succès",
            "responses": responses,
            "score": score,
            "user_id": user_id,
            "index": index,
        }
    )


@app.route("/api/downvote", methods=["POST"])
def downvote():
    data = request.get_json()
    username = data["username"]
    reply = data["reply"]

    # Rechercher la réponse dans la base de données
    response = collection_responses.find_one({"username": username, "reply": reply})
    if not response:
        app.logger.error("Réponse introuvable")
        return jsonify({"message": "Réponse introuvable"})

    # Mettre à jour le nombre de downvotes
    downvotes = response.get("downvote", 0)
    downvotes += 1

    # Mettre à jour le nombre de score
    score = response.get("score", 0)
    score -= 100

    # Mettre à jour la réponse dans la base de données
    collection_responses.update_one(
        {"username": username, "reply": reply},
        {"$set": {"downvote": downvotes, "score": score}},
    )
    app.logger.info("Downvote enregistré avec succès")
    return jsonify({"message": "Downvote enregistré avec succès"})

@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({"message": "it's working"})

@app.route("/api/canceldownvote", methods=["POST"])
def canceldownvote():
    data = request.get_json()
    username = data["username"]
    reply = data["reply"]

    # Rechercher la réponse dans la base de données
    response = collection_responses.find_one({"username": username, "reply": reply})
    if not response:
        app.logger.error("Réponse introuvable")
        return jsonify({"message": "Réponse introuvable"})

    # Mettre à jour le nombre de downvotes
    downvotes = response.get("downvote", 0)
    downvotes -= 1

    # Mettre à jour le nombre de score
    score = response.get("score", 0)
    score += 100

    # Mettre à jour la réponse dans la base de données
    collection_responses.update_one(
        {"username": username, "reply": reply},
        {"$set": {"downvote": downvotes, "score": score}},
    )
    app.logger.error("downvote annulé avec succès")
    return jsonify({"message": "downvote annulé avec succès"})


@app.route("/api/upvote", methods=["POST"])
def upvote():
    data = request.get_json()
    username = data["username"]
    reply = data["reply"]

    # Rechercher la réponse dans la base de données
    response = collection_responses.find_one({"username": username, "reply": reply})
    if not response:
        app.logger.error("Réponse introuvable")
        return jsonify({"message": "Réponse introuvable"})

    # Mettre à jour le nombre de upvotes
    upvotes = response.get("upvote", 0)
    upvotes += 1

    # Mettre à jour le nombre de score
    score = response.get("score", 0)
    score += 100

    # Mettre à jour la réponse dans la base de données
    collection_responses.update_one(
        {"username": username, "reply": reply},
        {"$set": {"upvote": upvotes, "score": score}},
    )
    app.logger.info("Upvote enregistré avec succès")
    return jsonify({"message": "Upvote enregistré avec succès"})


@app.route("/api/cancelupvote", methods=["POST"])
def cancelupvote():
    data = request.get_json()
    username = data["username"]
    reply = data["reply"]

    # Rechercher la réponse dans la base de données
    response = collection_responses.find_one({"username": username, "reply": reply})
    if not response:
        app.logger.error("Réponse introuvable")
        return jsonify({"message": "Réponse introuvable"})

    # Mettre à jour le nombre de upvotes
    upvotes = response.get("upvote", 0)
    upvotes -= 1

    # Mettre à jour le nombre de score
    score = response.get("score", 0)
    score -= 100

    # Mettre à jour la réponse dans la base de données
    collection_responses.update_one(
        {"username": username, "reply": reply},
        {"$set": {"upvote": upvotes, "score": score}},
    )

    app.logger.error("Upvote annulé avec succès")
    return jsonify({"message": "Upvote annulé avec succès"})


if __name__ == "__main__":
    app.run()
