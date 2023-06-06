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

load_dotenv(find_dotenv())

password = os.environ.get("MONGO_PWD")

connection_string = f"mongodb://127.0.0.1/discuss"

parsed_uri = parse_uri(connection_string)
host = parsed_uri["nodelist"][0][0]
port = parsed_uri["nodelist"][0][1]

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

client = MongoClient(host, port)
db = client.discuss
collection_users = db.usersdatas
collection_responses = db.responses


@app.route("/users", methods=["GET"])
def get_users():
    users = []
    for user in collection_users.find():
        users.append(
            {
                "username": user["username"],
                "email": user["email"],
                "password": user["password"],
            }
        )
    return jsonify({"users": users})


@app.route("/login", methods=["POST"])
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
regex_password = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')


@app.route("/users", methods=["POST"])
def create_users():
    data = request.get_json()
    username = data["username"].lower()
    email = data["email"].lower()
    password = data["password"]

    salt = bcrypt.gensalt()
    password = bcrypt.hashpw(password.encode("utf-8"), salt)

    # Conditions de validation
    if username == "" or email == "" or password == "":
        app.logger.error("Champ(s) invalide(s)")
        return jsonify({"message": "Champ(s) invalide(s)"})

    if not re.fullmatch(regex_username, username):
        app.logger.error("Username invalide")
        return jsonify({"message": "Username invalide"})

    if not re.fullmatch(regex, email):
        app.logger.error("Email invalide")
        return jsonify({"message": "Email invalide"})

    if not re.match(regex_password, password):
        app.logger.error("Le mot de passe ne respecte pas les critères de sécurité")
        return jsonify({"message": "Le mot de passe ne respecte pas les critères de sécurité"})

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



@app.route("/response", methods=["POST"])
def response():
    data = request.get_json()
    username = data["username"]
    reply = data["reply"]
    upvote = data["upvote"]
    downvote = data["downvote"]
    question = data["question"]
    heure_actuelle = datetime.now()

    user = collection_users.find_one({"username": username})
    if not user:
        return jsonify({"message": "Utilisateur non trouvé"})

    user_id = str(user["_id"])

    print(heure_actuelle)

    responses = {
        "question": question,
        "user_id": user_id,
        "username": username,
        "reply": reply,
        "upvote": upvote,
        "downvote": downvote,
        "heure": heure_actuelle,
    }
    response = collection_responses.insert_one(responses)

    # Après l'insertion de la réponse dans la base de données
    response_id = str(response.inserted_id)
    responses["_id"] = response_id

    return jsonify(
        {
            "message": "Réponse enregistrée avec succès",
            "responses": responses,
            "user_id": user_id,
        }
    )


@app.route("/getresponses", methods=["GET"])
def get_responses():
    responses = []
    for response in collection_responses.find():
        username = response["username"]
        users = collection_users.find({"username": username})
        for user in users:
            response_data = {"username": user["username"], "reply": response["reply"]}
            if "heure" in response:
                response_data["heure"] = response["heure"]
            responses.append(response_data)

    responses.reverse()
    return jsonify(responses)


if __name__ == "__main__":
    app.run()
