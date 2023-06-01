from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.uri_parser import parse_uri
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())

password = os.environ.get("MONGO_PWD")

connection_string = f"mongodb+srv://mathis:{password}@discuss.8rkcwju.mongodb.net/?retryWrites=true&w=majority"

parsed_uri = parse_uri(connection_string)
host = parsed_uri['nodelist'][0][0]
port = parsed_uri['nodelist'][0][1]

app = Flask(__name__)
CORS(app, resources={r"/users/*": {"origins": "*"}})

client = MongoClient(host, port)
db = client['discuss']
collection = db['usersdatas']

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

# @app.route('/login', methods=['POST'])
# def get_users():
#     users = []
#     for user in collection.find():
#         users.append({
#             'username': user['username'],
#             'email': user['email'],
#             'password': user['password']
#         })
#     return jsonify({'users': users})

if __name__ == '__main__':
    app.run()