from flask import Flask, request, jsonify
from pymongo import MongoClient
from pymongo.mongo_client import MongoClient
from pymongo.uri_parser import parse_uri
from pymongo.server_api import ServerApi
from dotenv import load_dotenv, find_dotenv
import pprint
import os
from pymongo import MongoClient
load_dotenv(find_dotenv())

password = os.environ.get("MONGO_PWD")

connection_string = f"mongodb+srv://mathis:{password}@discuss.8rkcwju.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(connection_string)

dbs = client.list_database_names()
print(dbs)
test_db = client.discuss
collections = test_db.list_collection_names()
print(collections)

parsed_uri = parse_uri(connection_string)
host = parsed_uri['nodelist'][0][0]
port = parsed_uri['nodelist'][0][1]

app = Flask("discuss")
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

if __name__ == '__main__':
    app.run()