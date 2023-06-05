from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.uri_parser import parse_uri
from dotenv import load_dotenv, find_dotenv
import os
import re
import bcrypt
from bson import ObjectId

load_dotenv(find_dotenv())

password = os.environ.get("MONGO_PWD")

connection_string = f"mongodb://127.0.0.1/discuss"

parsed_uri = parse_uri(connection_string)
host = parsed_uri['nodelist'][0][0]
port = parsed_uri['nodelist'][0][1]

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

client = MongoClient(host, port)
db = client.discuss
collection_users = db.usersdatas
collection_responses = db.responses

@app.route('/users', methods=['GET'])
def get_users():
    users = []
    for user in collection_users.find():
        users.append({
            'username': user['username'],
            'email': user['email'],
            'password': user['password']
        })
    return jsonify({'users': users})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email_or_username = data['emailOrUsername']  # Modifier le nom de la clé pour correspondre à la valeur du champ unique
    password = data['password']

    existing_user = collection_users.find_one({'$or': [{'email': email_or_username}, {'username': email_or_username}]})  # Utiliser la même logique pour vérifier email ou username
    if not existing_user:
        return jsonify({'message': 'Utilisateur non trouvé'})  # Modifier le message d'erreur si l'utilisateur n'existe pas

    hashed_password = existing_user['password']

    if not bcrypt.checkpw(password.encode('utf-8'), hashed_password):
        return jsonify({'message': 'Mot de passe incorrect'})

    # Ici, vous pouvez générer le jeton JWT

    return jsonify({'message': 'Authentification réussie'})


regex = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')


@app.route('/users', methods=['POST'])
def create_users():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']

    salt = bcrypt.gensalt()
    password = bcrypt.hashpw(password.encode('utf-8'), salt)

    # Conditions de validation
    if username == '' or email == '' or password == '':
        return jsonify({'message': 'Champ(s) invalide(s)'})

    existing_user = collection_users.find_one({'username': username})
    if existing_user:
        return jsonify({'message': 'Le nom d\'utilisateur est déjà pris'})

    existing_email = collection_users.find_one({'email': email})
    if existing_email:
        return jsonify({'message': 'L\'email est déjà pris'})

    if not re.fullmatch(regex, email):
        print('Email invalide')
        return jsonify({'message': 'Email invalide'})

    # Insérer le nouvel utilisateur dans la base de données
    user_data = {
        'username': username,
        'email': email,
        'password': password
    }

    collection_users.insert_one(user_data)

    return jsonify({'message': 'Utilisateur créé avec succès'})

# Génération du sel aléatoire
salt = bcrypt.gensalt()


@app.route('/response', methods=['POST'])
def response():
    data = request.get_json()
    username = data['username']
    reply = data['reply']
    
    user = collection_users.find_one({'username': username})
    if not user:
        return jsonify({'message': 'Utilisateur non trouvé'})

    username = str(user['_id'])  # Convertir l'ObjectId en une chaîne de caractères

    answer = {
        'username': username,
        'reply': reply,
        'username': user_id
    }

    response = collection_responses.insert_one(answer)

    answer['_id'] = str(response.inserted_id)  # Convertir l'ObjectId en une chaîne de caractères

    return jsonify({'message': 'Réponse enregistrée avec succès', 'answer': answer})



@app.route('/getresponses', methods=['GET'])
def get_responses():
    responses = []
    for response in collection_responses.find():
        username = response['username']
        users = collection_users.find({'username': username})
        for user in users:
            response_data = {
                'username': user['username'],
                'reply': response['reply']
            }
            responses.append(response_data)

    responses.reverse()
    return jsonify(responses)





if __name__ == '__main__':
    app.run()
