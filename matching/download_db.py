from google.cloud import firestore
import google.cloud.exceptions
import json

def main():
	# Script should be run in a terminal with env var
	# GOOGLE_APPLICATION_CREDENTIALS set to the path of the file
	# containing the service account key for reddit-submatch
	db = firestore.Client()
	user_docs = db.collection(u'users').stream()
	blacklist_docs = db.collection(u'blacklists').stream()
	user_data = []
	blacklist_data = []
	
	for doc in user_docs:
	    user = doc.to_dict()
	    user.update({ "name": doc.id })
	    user_data.append(user)

	for doc in blacklist_docs:
	    blacklist = doc.to_dict()
	    blacklist.update({ "name": doc.id })
	    blacklist_data.append(blacklist)
	
	with open('db.json', 'w', encoding='utf-8') as f:
	    json.dump(user_data, f, ensure_ascii=False, indent=4)

	with open('blacklists.json', 'w', encoding='utf-8') as f:
	    json.dump(blacklist_data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
	main()