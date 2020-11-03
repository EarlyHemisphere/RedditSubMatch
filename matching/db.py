import google.cloud.exceptions
from google.cloud import firestore
from google.cloud import storage
from logger import log
from pathlib import Path
import json
import os
import Config

round_number = Config.round_number
cur_dir = os.getcwd()
storage_client = storage.Client()
bucket = storage_client.bucket(Config.bucket_name)
logger = log('db')

def download_db():
	# Script should be run in a terminal with env var
	# GOOGLE_APPLICATION_CREDENTIALS set to the path of the file
	# containing the service account key for reddit-submatch
	db = firestore.Client()
	user_docs = db.collection(u'users').stream()
	blacklist_docs = db.collection(u'blacklists').stream()
	exclusion_list_docs = db.collection(u'exclusion lists').stream()
	user_data, blacklist_data, exclusion_list_data = [], [], []
	cur_dir = os.getcwd()
	forbidden_matches = set()
	
	for doc in user_docs:
	    user = doc.to_dict()
	    user.update({ "name": doc.id })
	    user_data.append(user)

	for doc in blacklist_docs:
	    blacklist = doc.to_dict()
	    blacklist.update({ "name": doc.id })
	    blacklist_data.append(blacklist)

	for doc in exclusion_list_docs:
	    exclusion_list = doc.to_dict()
	    exclusion_list.update({ "name": doc.id })
	    exclusion_list_data.append(exclusion_list)
	
	with open('db.json', 'w', encoding='utf-8') as f:
	    json.dump(user_data, f, ensure_ascii=False, indent=4)

	with open('blacklists.json', 'w', encoding='utf-8') as f:
	    json.dump(blacklist_data, f, ensure_ascii=False, indent=4)

	with open('exclusion_lists.json', 'w', encoding='utf-8') as f:
	    json.dump(exclusion_list_data, f, ensure_ascii=False, indent=4)

	Path(f'{cur_dir}/previous').mkdir(parents=True, exist_ok=True)
	for i in range(1, Config.round_number):
		logger.info(f'downloading data for matching round {i}')
		blob = bucket.blob(f'match{i}_matches.json')
		blob.download_to_filename(f'{cur_dir}/previous/match{i}_matches.json')
		logger.info(f'downloaded data matching round {i}')

		with open(f'{cur_dir}/previous/match{i}_matches.json') as f:
			for match in json.load(f)['matches']:
				forbidden_matches.add((match[0].lower(), match[1].lower()))
				logger.debug(f'added forbidden match {match[0]} and {match[1]}')

		# Get the previous match's unmatched users to prioritize
		if i == Config.round_number - 1:
			logger.info(f'downloading matching round {i} unmatched users')
			blob = bucket.blob(f'match{i}_unmatched_users.json')
			blob.download_to_filename(f'{cur_dir}/previous/previous_unmatched_users.json')
			logger.info(f'downloaded matching round {i} unmatched users')
	
	return forbidden_matches

def upload_matching_results(matches, unmatched_users, empty_users, subs):
    blob = bucket.blob(f'match{round_number}_db.json')
    blob.upload_from_filename('db.json')
    blob = bucket.blob(f'match{round_number}_subs.json')
    blob.upload_from_filename(f'{cur_dir}/output/subs.json')
    blob = bucket.blob(f'match{round_number}_matches.json')
    blob.upload_from_filename(f'{cur_dir}/output/matches.json')
    blob = bucket.blob(f'match{round_number}_unmatched_users.json')
    blob.upload_from_filename(f'{cur_dir}/output/unmatched_users.json')
    blob = bucket.blob(f'match{round_number}_empty_users.json')
    blob.upload_from_filename(f'{cur_dir}/dump/empty_users.json')