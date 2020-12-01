import praw
from prawcore.exceptions import ServerError
from logger import log
import json
import Config
import os
from pathlib import Path

logger = log('reddit')

def get_user_subscriptions():
	users = []
	empty_users = []
	subs = {}
	erroredUsers = []
	i = 1
	
	with open('../shared/nsfw_subs.json', 'r') as f:
		nsfw_subs = set(json.load(f)['subs'])
	
	with open('db.json') as f:
		db_entries = json.load(f)
	
	n = len(db_entries)
	
	for db_entry in db_entries:
		print(f'Processing user {str(i)} of {n}', end='\r')
		logger.info(f'Processing user {str(i)} of {n} with username {db_entry["name"]}')
	
		refresh_token = db_entry['refreshToken']
		if not refresh_token:
			raise Exception('null refreshToken')
		
		reddit_user = praw.Reddit(client_id=Config.webapp_client_id,
						 client_secret=Config.webapp_client_secret,
						 refresh_token=refresh_token,
						 user_agent=Config.user_agent)
		
		user_subs = []
		
		while True: # loop to keep trying if response 500 is received
			try:
				# suspended users cannot be messaged, and therefore cannot take part in matching
				if reddit_user.user.me().is_suspended:
					logger.info('user is suspended')
					break
				
				subreddit_subscriptions = list(reddit_user.user.subreddits(limit=None))

				for subreddit in subreddit_subscriptions:
					subreddit_name = subreddit.display_name
					if subreddit_name[0:2] != 'u_' and subreddit_name not in nsfw_subs:
						user_subs.append(subreddit_name)
						if subreddit_name not in subs:
							subs[subreddit_name] = subreddit.subscribers
		
				if not user_subs:
					empty_users.append(db_entry['name'])
				else:
					users.append({'name': db_entry['name'], 'subscriptions': user_subs})
				logger.debug(user_subs)
				break
			except ServerError as e:
				print(e)
				print(db_entry)
				print('Retrying...')
			except Exception as e:
				print(e)
				print(db_entry['name'])
				erroredUsers.append(db_entry['name'])
				break
	
		i += 1

	logger.info(f'Number of failed user info retrieval attempts: {len(erroredUsers)}')
	logger.debug(erroredUsers)
	logger.debug(empty_users)

	# dump in case something goes wrong during matching
	cur_dir = os.getcwd()
	Path(f'{cur_dir}/dump').mkdir(parents=True, exist_ok=True)
	with open(f'{cur_dir}/dump/subs.json', 'w', encoding='utf-8') as f:
		json.dump({ 'subs': subs }, f, ensure_ascii=False, indent=4)

	with open(f'{cur_dir}/dump/users.json', 'w', encoding='utf-8') as f:
		json.dump({ 'users': users }, f, ensure_ascii=False, indent=4)

	with open(f'{cur_dir}/dump/empty_users.json', 'w', encoding='utf-8') as f:
		json.dump({ 'empty_users': empty_users }, f, ensure_ascii=False, indent=4)

	return users, empty_users, subs

def message_users(matches, unmatched_users, empty_users, round_number):
	submatch_bot = praw.Reddit(user_agent=Config.user_agent,
					username=Config.username, password=Config.password,
					client_id=Config.script_client_id, client_secret=Config.script_client_secret,
					refresh_token=Config.script_refresh_token)
	messageSubject = f'Submatch Matching Round {round_number} Results'
	messageFooter = '-----\n\n^I ^do ^not ^reply ^to ^messages ^| ^[Code](https://github.com/LucasAnderson07/RedditSubMatch) ^| ^Problems ^with ^your ^match ^or ^have ^questions? ^[Message](https://www.reddit.com/message/compose/?to=r/submatch) ^the ^mods'
	deleted_matches = []

	print('messaging empty users...')
	for user in empty_users:
		message = f'Hey {user},\n\n'
		message += 'Unfortunately, you were not matched this round because you currently aren\'t subscribed to any subreddits that are SFW!\n\n'
		message += 'If you would like to participate in the next round of matching, please subscribe to subreddits that align with your interests.\n\n'
		message += messageFooter
		try:
			submatch_bot.redditor(user).message(messageSubject, message)
			logger.info(f'messaged empty user {user}')
		except Exception as e:
			logger.error(f'received error when attempting to message {user}')
			logger.error(e)

	print('messaging unmatched users...')
	for user in unmatched_users:
		message = f'Hey {user},\n\n'
		message += 'Unfortunately, a good match was unable to be found for you this round.\n\n'
		message += 'However, every round of matching always prioritizes unmatched users from the round before, so you are sure to get a match next round!\n\n'
		message += 'Also, chances of getting a better match can always be increased by subscribing to more subreddits that align with your interests.\n\n'
		message += messageFooter
		try:
			submatch_bot.redditor(user).message(messageSubject, message)
			logger.info(f'messaged unmatched user {user}')
		except Exception as e:
			logger.error(f'received error when attempting to message {user}')
			logger.error(e)

	print('messaging matched users...')
	for match in matches:
		user1 = match[0]
		user2 = match[1]
		for _ in range(2):
			message = f'Hey {user1},\n\n'
			message += f'You have been matched with u/{user2}! Here is the list of {"" if len(match[2]) < 100 else "the 100 smallest "}subreddits the two of you have in common:\n\n'
			i = 1
			for subreddit in match[2]:
				message += f'- r/{subreddit[1]} - {subreddit[0]} subscribers\n'
				if i == 100:
					break
				i += 1
			message += f'\nWanna send u/{user2} a message? [Click this link!](https://www.reddit.com/message/compose/?to={user2})\n\n'
			message += messageFooter
			try:
				submatch_bot.redditor(user1).message(messageSubject, message)
				logger.info(f'messaged matched user {user1} about match with {user2}')
			except Exception as e:
				logger.error(f'received error when attempting to message {user1}')
				logger.error(e)
				deleted_matches.append(user2)
			user1, user2 = user2, user1

	return deleted_matches