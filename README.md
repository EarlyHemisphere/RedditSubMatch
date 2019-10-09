# RedditSubMatch

A tool for matching Redditors with similar interests based on their subreddit subscriptions and activity.

## Preliminary notes based on the suggestions of Redditors

### Resources

 - https://anvaka.github.io/sayit
 - apparently https://www.reddit.com/r/Serendipity has a bot with similar tactics
 - Gensim's word2vec modeling package
 - /u/Evthma's association rule mining subreddit dataset
 - Pushshift.io for unlimited user data

### Algorithms/Methods

 - collaborative filtering
 - priori/association rule learning
 - Hausdorff distance of sets
 - Jaccard Index
 
### Things to take into account:

 - default subreddit subscriptions
 - remove NSFW subreddits (or have the option to?)
 - number of subscribers in a sub (smaller subs could be a more special interest)
 - activity vs subscriptions
 
### Other notes:

 - *__Discussion with the actual owner of r/submatch is currently ongoing about how to proceed with development.__*
 - Issues will be created tomorrow regarding for anyone's input regarding:
    - structure of the repo
    - algorithm discussion/planning
    - how the tool will be made available to users (webapp? bot?)
