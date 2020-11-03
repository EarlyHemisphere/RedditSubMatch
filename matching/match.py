import json
import os
import numpy as np
from pathlib import Path
from logger import log

logger = log('matching')

def _get_common(user1, user2, subs):
	common_subs = set(user1['subscriptions']).intersection(user2['subscriptions'])
	common_subs_with_sub_count = []
	for sub in common_subs:
		common_subs_with_sub_count.append([subs[sub], sub])
	common_subs_with_sub_count.sort()
	return common_subs_with_sub_count

def _total_entropy(subs_in_common, max_subscribers):
	return sum(-np.log2(x[0] / max_subscribers) for x in subs_in_common)

def _get_rank(candidate_matches_of_user, matched_user):
	i = 0
	while True:
		if candidate_matches_of_user[i][1] == matched_user or candidate_matches_of_user[i][2] == matched_user:
			return i + 1
		i += 1

def _get_greedy_matches_with_prioritization(users, prioritization_queue, candidate_matches):
	matched = [False] * len(users)
	matches = []

	for user in prioritization_queue:
		for match in candidate_matches:
			_, h, common, i, j = match
			if (i == user and not matched[j]) or (j == user and not matched[i]):
				temp = [users[i]['name'], users[j]['name'], common, h]
				logger.debug(temp)
				matches.append(temp)
				matched[i] = True
				matched[j] = True
				break

	for m in candidate_matches:
		_, h, common, i, j = m
		if matched[i] or matched[j]:
			continue
		temp = [users[i]['name'], users[j]['name'], common, h]
		logger.debug(temp)
		matches.append(temp)
		matched[i] = True
		matched[j] = True

	return matched, matches

def match_users(users, subs, prioritization_queue, forbidden_matches, max_subscribers, min_entropy=10.0):
	print('matching in progress...')

	candidate_matches = []
	user_candidate_matches = [[] for _ in range(len(users))]

	for i in range(len(users)):
		a = users[i]
		for j in range(i + 1, len(users)):
			b = users[j]
			common = _get_common(a, b, subs)
			h = _total_entropy(common, max_subscribers)
			if h >= min_entropy and (users[i]['name'].lower(), users[j]['name'].lower()) not in forbidden_matches and (users[j]['name'].lower(), users[i]['name'].lower()) not in forbidden_matches:
				candidate_matches.append([h, common, i, j])
				user_candidate_matches[i].append([h, i, j])
				user_candidate_matches[j].append([h, i, j])

	for m in user_candidate_matches:
		m.sort(reverse=True)

	# Lower the overall matching score for candidate matches based on how many total candidate matches a user has and what
	# rank the candidate match is in a descending ordering of the user's candidate matches by total entropy of common subs
	for m in candidate_matches:
		i, j = m[-2:]
		m.insert(0, m[0] * (0.8 ** _get_rank(user_candidate_matches[i], j)) * (0.8 ** _get_rank(user_candidate_matches[j], i)))
	candidate_matches.sort(reverse=True)

	matched, matches = _get_greedy_matches_with_prioritization(users, prioritization_queue, candidate_matches)

	unmatched_users = []
	for i in range(len(matched)):
		if not matched[i]:
			logger.debug(f'user ended up unmatched: {users[i]}')
			logger.debug(f'{users[i]["subscriptions"]}')
			unmatched_users.append(users[i]['name'])
		
	print('matching complete. writing to local storage...')
	logger.info('matching complete. writing to local storage...')

	cur_dir = os.getcwd()
	Path(f'{cur_dir}/output').mkdir(parents=True, exist_ok=True)
	with open(f'{cur_dir}/output/subs.json', 'w', encoding='utf-8') as f:
		json.dump({ 'subs': subs }, f, ensure_ascii=False, indent=4)
	with open(f'{cur_dir}/output/unmatched_users.json', 'w', encoding='utf-8') as f:
		json.dump({ 'users': unmatched_users }, f, ensure_ascii=False, indent=4)
	with open(f'{cur_dir}/output/matches.json', 'w', encoding='utf-8') as f:
		json.dump({ 'matches': matches }, f, ensure_ascii=False, indent=4)
	logger.info('created files')

	return matches, unmatched_users

def count_meaningless_matches(matches, users, subs):
	count = 0
	for m in matches:
		common = m[2]
		if all(s[0] > 10**7 for s in common):
			count += 1
	return count