# RedditSubMatch

A tool for matching Redditors with similar interests based on their subreddit subscriptions and activity.

## Please Note:

The owner of r/submatch has created a post with some outlines for how development will proceed and places for discussion, please check it out if you're interested: https://www.reddit.com/r/submatch/comments/dffo44/message_to_all_interested_programmers/

## Code

Decided to setup docker just in case, can be built/ran with `./run.sh` if Docker is installed.

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
