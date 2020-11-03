# ***** Algorithm developed by u/rawr4me *****
# ***** Final tweaks by u/EarlyHemisphere ****

from pathlib import Path
import json
import numpy as np
import copy
import sys
import os
import Config
import db
import reddit
import match
from logger import log

logger = log('main')

def main():
	# Script should be run in a terminal with env var
	# GOOGLE_APPLICATION_CREDENTIALS set to the path of the file
	# containing the service account key for reddit-submatch
	
	round_number = Config.round_number
	cur_dir = os.getcwd()

	print('downloading data from previous matches...')
	logger.info('downloading data from previous matches...')
	forbidden_matches = db.download_db()

	previous_unmatched_users = set()
	with open(f'{cur_dir}/previous/previous_unmatched_users.json') as f:
		unmatched_usernames = json.load(f)['users']
		for user in unmatched_usernames:
			previous_unmatched_users.add(user.lower())
	
	logger.debug("PREVIOUS UNMATCHED USERS: " + str(len(previous_unmatched_users)))
	logger.debug(previous_unmatched_users)

	with open('blacklists.json', 'r') as f:
		logger.info('loading blacklists...')
		blacklists = json.load(f)
		for blacklist in blacklists:
			for user in blacklist['blacklist']:
				forbidden_matches.add((blacklist['name'].lower(), user.lower()))
				logger.debug(f'added blacklisted match {blacklist["name"]} and {user} to forbidden matches')

	logger.debug("FORBIDDEN MATCHES: " + str(len(forbidden_matches)))
	logger.debug(forbidden_matches)

	if round_number > 1 and not previous_unmatched_users:
		raise Exception('previous unmatched user retrieval failed')
	
	# with open(f'{cur_dir}/dump/users.json', 'r') as f:
	#     users = json.load(f)['users']
	
	# with open(f'{cur_dir}/dump/subs.json', 'r') as f:
	#     subs = json.load(f)['subs']
	
	# with open(f'{cur_dir}/dump/empty_users.json', 'r') as f:
	#     empty_users = json.load(f)['empty_users']

	logger.info('getting user subscriptions...')
	users, empty_users, subs = reddit.get_user_subscriptions()
	sorted_sub_numbers = sorted([v for v in subs.values()])
	MAX_SUBSCRIBERS = sorted_sub_numbers[-2]
	logger.debug(f'MAX_SUBSCRIBERS: {MAX_SUBSCRIBERS}')

	subs_to_ignore = ['submatch', 'announcements', 'Coronavirus']
	for k, v in subs.items():
		if v == 0:
			subs_to_ignore.append(k)
	logger.debug(subs_to_ignore)

	exclusion_lists = {}
	with open('exclusion_lists.json', 'r') as f:
		logger.info('loading exclusion lists...')
		exclusion_list_data = json.load(f)
		for exclusion_list in exclusion_list_data:
			exclusion_lists[exclusion_list['name']] = exclusion_list['subreddits']
			logger.debug(f'read exclusion list for user {exclusion_list["name"]}')
	
	logger.debug(exclusion_lists)

	# Filter out meaningless subs and subs the user has excluded
	for user in users:
		user['subscriptions'] = [x for x in user['subscriptions'] if x not in subs_to_ignore and x not in exclusion_lists.get(user['name'], [])]

	prioritization_queue = set()
	for i in range(len(users)):
		if users[i]['name'] in previous_unmatched_users:
			logger.debug(f'prioritizing user {users[i]} {i}')
			prioritization_queue.add(i)

	logger.info('matching users...')
	matches, unmatched_users = match.match_users(users, subs, prioritization_queue, forbidden_matches, MAX_SUBSCRIBERS)

	# with open(f'{cur_dir}/output/matches.json', 'r') as f:
	#     matches = json.load(f)['matches']

	# with open(f'{cur_dir}/output/unmatched_users.json', 'r') as f:
	#     unmatched_users = json.load(f)['users']

	logger.debug(matches)
	logger.debug(unmatched_users)

	db.upload_matching_results(matches, unmatched_users, empty_users, subs)
	logger.info('uploaded files')

	logger.info('messaging users...')
	deleted_matches = reddit.message_users(matches, unmatched_users, empty_users, round_number)

	print('done!')
	logger.info('done!')
	logger.info(f'users with deleted matches: {deleted_matches}')

	logger.debug('matching statistics:')
	logger.debug(f'{len(matches)} out of {len(users)} users')
	logger.debug(f'Number of unmatched users: {len(unmatched_users)}')
	logger.debug(f'Number of empty users: {len(empty_users)}')
	entropy = [m[3] for m in matches]
	subs_in_common = [len(m[2]) for m in matches]
	logger.debug(f'Mean/median matches: {np.mean(subs_in_common):.2f} {np.median(subs_in_common):.2f}')
	logger.debug(f'Meaningless matches: {match.count_meaningless_matches(matches, users, subs)}')    
	logger.debug(f'Mean/median entropy: {np.mean(entropy):.2f} {np.median(entropy):.2f}')
	logger.debug(unmatched_users)
	logger.debug(empty_users)

if __name__ == "__main__":
	main()
