# ***** Algorithm developed by u/rawr4me *****
# ***** Final tweaks by u/EarlyHemisphere ****

from google.cloud import firestore
from google.cloud import storage
from pathlib import Path
import google.cloud.exceptions
import praw
import json
import numpy as np
import copy
import sys
import Config

def get_user_subscriptions():
    users = []
    empty_users = []
    subs = {}
    errors = 0
    i = 1
    
    with open('nsfw_subs.json', 'r') as f:
        nsfw_subs = set(json.load(f)['subs'])
    f.close()
    
    with open('db.json') as f:
        db_entries = json.load(f)
    f.close()
    
    n = len(db_entries)
    
    for db_entry in db_entries:
        print(f'Processing user {str(i)} of {n}', end='\r')
    
        refresh_token = db_entry['refreshToken']
        if not refresh_token:
            raise Exception('null refreshToken')
    
        reddit_user = praw.Reddit(client_id=Config.webapp_client_id,
                         client_secret=Config.webapp_client_secret,
                         refresh_token=refresh_token,
                         user_agent=Config.user_agent)
        user_subs = []
        
        try:
            subreddit_subscriptions = list(reddit_user.user.subreddits(limit=None))

            if len(subreddit_subscriptions) == 0:
                empty_users.append(db_entry['name'])
            else:
                for subreddit in subreddit_subscriptions:
                    subreddit_name = subreddit.display_name
                    if subreddit_name[0:2] != 'u_' and subreddit_name not in nsfw_subs:
                        user_subs.append(subreddit_name)
                        if subreddit_name not in subs:
                            subs[subreddit_name] = subreddit.subscribers
    
                users.append({'name': db_entry['name'], 'subscriptions': user_subs})
        except Exception as e:
            print(e)
            errors += 1
    
        i += 1

    print(f'Number of failed user info retrieval attempts: {str(errors)}')

    return users, empty_users, subs

def get_common(user1, user2, subs):
    common_subs = set(user1['subscriptions']).intersection(user2['subscriptions'])
    common_subs_with_sub_count = []
    for sub in common_subs:
        common_subs_with_sub_count.append([subs[sub], sub])
    common_subs_with_sub_count.sort()
    return common_subs_with_sub_count

def total_entropy(subs_in_common, max_subscribers):
    return sum(-np.log2(x[0] / max_subscribers) for x in subs_in_common)

def get_rank(candidate_matches_of_user, matched_user):
    i = 0
    while True:
        if candidate_matches_of_user[i][1] == matched_user or candidate_matches_of_user[i][2] == matched_user:
            return i + 1
        i += 1

def get_greedy_matches_with_prioritization(users, prioritization_queue, candidate_matches):
    matched = [False] * len(users)
    matches = []

    for user in prioritization_queue:
        for match in candidate_matches:
            i, j = match[-2:]
            if (i == user and not matched[j]) or (j == user and not matched[i]):
                matches.append(match)
                matched[i] = True
                matched[j] = True
                break

    for m in candidate_matches:
        common, i, j = m[-3:]
        if matched[i] or matched[j]:
            continue
        matches.append([users[i]['name'], users[j]['name'], common])
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
            common = get_common(a, b, subs)
            h = total_entropy(common, max_subscribers)
            if h >= min_entropy and (users[i]['name'], users[j]['name']) not in forbidden_matches and (users[j]['name'], users[i]['name']) not in forbidden_matches:
                candidate_matches.append([h, common, i, j])
                user_candidate_matches[i].append([h, i, j])
                user_candidate_matches[j].append([h, i, j])

    for m in user_candidate_matches:
        m.sort(reverse=True)

    # Lower the overall matching score for candidate matches based on how many total candidate matches a user has
    for m in candidate_matches:
        i, j = m[-2:]
        m.insert(0, m[0] * (0.8 ** get_rank(user_candidate_matches[i], j)) * (0.8 ** get_rank(user_candidate_matches[j], i)))
    candidate_matches.sort(reverse=True)

    matched, matches = get_greedy_matches_with_prioritization(users, prioritization_queue, candidate_matches)

    unmatched_users = []
    for i in range(len(matched)):
        if not matched[i]:
            unmatched_users.append(users[i]['name'])

    return matches, unmatched_users

def message_users(matches, unmatched_users, empty_users, round_number):
    submatch_bot = praw.Reddit(user_agent=Config.user_agent,
                    username=Config.username, password=Config.password,
                    client_id=Config.script_client_id, client_secret=Config.script_client_secret,
                    refresh_token=Config.script_refresh_token)
    messageSubject = f'Submatch Matching Round {round_number} Results'
    messageFooter = '-----\n\n^I ^do ^not ^reply ^to ^messages. ^| ^[Code](https://github.com/LucasAnderson07/RedditSubMatch) ^| ^Problems ^with ^your ^match ^or ^have ^questions? ^[Message](https://www.reddit.com/message/compose/?to=r/submatch) ^the ^mods'

    print('messaging empty users...')
    for user in empty_users:
        message = f'Hey {user},\n\n'
        message += 'Unfortunately, you were not matched this round because you currently aren\'t subscribed to any subreddits!\n\n'
        message += 'If you would like to participate in the next round of matching, please subscribe to subreddits that align with your interests.\n\n'
        message += messageFooter
        submatch_bot.redditor(user).message(messageSubject, message)

    print('messaging unmatched users...')
    for user in unmatched_users:
        message = f'Hey {user},\n\n'
        message += 'Unfortunately, a good match was unable to be found for you this round.\n\n'
        message += 'However, every round of matching always prioritizes unmatched users from the round before, so you are sure to get a match next round!\n\n'
        message += 'Also, chances of a better match can always be increased by subscribing to more subreddits that align with your interests.\n\n'
        message += messageFooter
        submatch_bot.redditor(user).message(messageSubject, message)

    print('messaging matched users...')
    for match in matches:
        user1 = match[0]['name']
        user2 = match[1]['name']
        for _ in range(2):
            message = f'Hey {user1},\n\n'
            message += f'You have been matched with u/{user2}! Here is the list of {"" if len(match[2]) < 50 else "the 50 smallest "}subreddits the two of you have in common, sorted in ascending order of subscriber count:\n\n'
            i = 1
            for subreddit in match[2]:
                message += f'- r/{subreddit[1]} - {subreddit[0]} subscribers\n'
                if i == 50:
                    break
                i += 1
            message += f'\nWanna send u/{user2} a message? [Click this link!](https://www.reddit.com/message/compose/?to={user2})\n\n'
            message += messageFooter
            submatch_bot.redditor(user1).message(messageSubject, message)
            user1, user2 = user2, user1

def main():
    # Script should be run in a terminal with env var
    # GOOGLE_APPLICATION_CREDENTIALS set to the path of the file
    # containing the service account key for reddit-submatch
    forbidden_matches = set()
    round_number = Config.round_number
    storage_client = storage.Client()
    bucket = storage_client.bucket(Config.bucket_name)

    print('downloading data from previous matches...')
    for i in range(1, round_number):
        blob = bucket.blob(f'match{i}_matches.json')
        blob.download_to_filename(f'match{i}_matches.json')

        with open('match{i}_matches.json') as f:
            matches = json.load(f)
            for match in matches['matches']:
                forbidden_matches.add((match[0], match[1]))
        f.close()

        # Get the previous match's unmatched users to prioritize
        if i == round_number - 1:
            blob = bucket.blob(f'match{i}_unmatched_users.json')
            blob.download_to_filename('previous_unmatched_users.json')

    try:
        with open('previous_unmatched_users.json') as f:
            previous_unmatched_users = set(json.load(f))
        f.close()
    except FileNotFoundError:
        previous_unmatched_users = set()

    users, empty_users, subs = get_user_subscriptions()
    sorted_sub_numbers = sorted([v for v in subs.values()])
    MAX_SUBSCRIBERS = sorted_sub_numbers[-2]

    subs_to_ignore = ['submatch', 'announcements']
    for k, v in subs.items():
        if v == 0:
            subs_to_ignore.append(k)

    # Filter out meaningless subs
    for user in users:
        user['subscriptions'] = [x for x in user['subscriptions'] if x not in subs_to_ignore]

    prioritization_queue = set()
    for i in range(len(users)):
        if users[i] in previous_unmatched_users:
            prioritization_queue.add(i)

    matches, unmatched_users = match_users(users, subs, prioritization_queue, forbidden_matches, MAX_SUBSCRIBERS)

    print('matching complete. writing to local storage...')
    Path("/output").mkdir(parents=True, exist_ok=True)

    with open('/output/unmatched_users.json', 'w', encoding='utf-8') as f:
        json.dump({ 'users': users }, f, ensure_ascii=False, indent=4)
    f.close()
    with open('/output/matches.json', 'w', encoding='utf-8') as f:
        json.dump({ 'matches': matches }, f, ensure_ascii=False, indent=4)
    f.close()
    with open('/output/empty_users.json', 'w', encoding='utf-8') as f:
        json.dump({ 'empty_users': empty_users }, f, ensure_ascii=False, indent=4)
    f.close()

    blob = bucket.blob(f'match{round_number}_matches.json')
    blob.upload_from_filename('/output/matches.json')
    blob = bucket.blob(f'match{round_number}_unmatched_users.json')
    blob.upload_from_filename('/output/unmatched_users.json')
    blob = bucket.blob(f'match{round_number}_empty_users.json')
    blob.upload_from_filename('/output/empty_users.json')

    message_users(matches, unmatched_users, empty_users, round_number)

    print('done!')

if __name__ == "__main__":
    main()
