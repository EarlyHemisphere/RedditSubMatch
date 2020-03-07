from google.cloud import firestore
import google.cloud.exceptions
import json
import requests
import praw

# Script should be run in a terminal with env var
# GOOGLE_APPLICATION_CREDENTIALS set to the path of the file
# containing the service account key for reddit-submatch
db = firestore.Client()
docs = db.collection(u'users').stream()
data = []

for doc in docs:
    data.append(doc.to_dict())

with open('db.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)