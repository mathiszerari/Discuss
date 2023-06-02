from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.uri_parser import parse_uri
from dotenv import load_dotenv, find_dotenv
import os
import re
import bcrypt

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
collection = db.usersdatas

@app.route('/users', methods=['GET'])
def get_users():
    users = []
    for user in collection.find():
        users.append({
            'username': user['username'],
            'email': user['email'],
            'password': user['password']
        })
    return jsonify({'users': users})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    existing_user = collection.find_one({'email': email})
    print(existing_user)
    if not existing_user:
        return jsonify({'message': 'Utilisateur introuvable'})
    
    salt = bcrypt.gensalt()
    password = bcrypt.hashpw(password.encode('utf-8'), salt)

    if not bcrypt.checkpw(password.encode('utf-8'), existing_user['password']):
        return jsonify({'message': 'Mot de passe incorrecte'} )
    
    # içi on créer le token jwt

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
    
    existing_user = collection.find_one({'username': username})
    if existing_user:
        return jsonify({'message': 'Le nom d\'utilisateur est déjà pris'})
    
    existing_email = collection.find_one({'email': email})
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

    collection.insert_one(user_data)
    
    return jsonify({'message': 'Utilisateur créé avec succès'})



mdp = "motdepasse123"

# Génération du sel aléatoire
salt = bcrypt.gensalt()

# Hachage du mot de passe avec le sel

# Vérification du mot de passe haché



if __name__ == '__main__':
    app.run()