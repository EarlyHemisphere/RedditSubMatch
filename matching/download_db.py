from google.cloud import firestore
import google.cloud.exceptions
import json

def main():
	# Script should be run in a terminal with env var
	# GOOGLE_APPLICATION_CREDENTIALS set to the path of the file
	# containing the service account key for reddit-submatch
	db = firestore.Client()
	docs = db.collection(u'users').stream()
	data = []
	
	for doc in docs:
	    user = doc.to_dict()
	    user.update({ "name": doc.id })
	    data.append(user)
	
	with open('db.json', 'w', encoding='utf-8') as f:
	    json.dump(data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
	main()
