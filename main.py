import random
import praw

r = praw.Reddit(client_id='',
				client_secret='',
				redirect_uri='http://localhost:8080',
				user_agent='script that matches reddit users based on activity and subscriptions')

redditScopes = ['mysubreddits']
stateValue = str(random.randint(512, 1024))
url = r.auth.url(redditScopes, stateValue, 'permanent')
# get user to enter username and password, giving access to their subreddit subscriptions