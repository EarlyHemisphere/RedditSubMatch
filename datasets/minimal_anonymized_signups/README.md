# Dataset of anonymized signups

In the original signup format for submatch, participants were asked to list 10-20 subreddits they subscribed to and to indicate their top 5 favorites. This is a partial dataset constructed from some actual responses. For privacy reasons, all the data has been anonymized to remove usernames and the exact subreddit names. We realize this anonymization severely limits the potential for deeper analysis, but experimenting with matching based on this minimal dataset also helps determine to what extent complicated matching is even necessary. Although we haven't decided any of the finer details, ultimately the information we request in signups is going to be different to what's here. (For example, we will likely obtain a user's whole list of subreddits via PRAW instead of having them manually type them in.)

## What's the point of this dataset?

This is the only authentic data that exists at the moment, and we're releasing it for a couple of reasons:

* Anyone can have a play with it and get a taste of the matching problem regardless of whether they will end up contributing to the submatch project.
* People who are keen to experiment with matching can help us answer the key question that numerous design aspects and overall scope of the project depend on: how many signups are required to provide satisfactory odds of getting a match, and at what quality of matching? We want rough numbers no matter how uncertain they are.

## Things to think about

The original intention of matching was for each user to only be matched once (if they're lucky enough to be matched at all). Although we aren't restricted to that, this scenario poses an important question: if someone is compatible with multiple other individuals, and only one match is allowed for each person, which match should be selected?

There are a lot of questions to be considered aside from coming up with a scoring algorithm for potential matches:

* What is the nature of the trade-off between number of matches and quality? How much does prioritizing the number of matches degrade the quality?
* Does focusing primarily on quality result in unequal opportunity?
* Is it more fair if people with highly generic interests are matched with other people with highly generic interests?
* Are there ways for people to abuse the matching algorithm by listing a million subs?
* What is the minimum number of matched subreddits (and of what popularity level) that is still acceptable to a user?
* How do we judge the performance of different matching algorithms?

The kind of suggestions we're looking for are fundamentally about providing a worthwhile user experience, so we are very interested in insights about design choices from the user perspective.

## Notes about the dataset

* `anon_users.json` stores the users with the subreddits they specified (only a minimum of 5 was enforced) and their top 5 favorites within those.
* `anon_subs.json` stores the number of subscribers for a given subredddit.
* Every user in this dataset is unique/distinct.
* Although we cleaned up a lot of problems with the dataset, it still isn't 100% perfect. Sorry.
* NSFW subreddits were not removed, private and banned subreddits are.
* It is recommended that the order of each user's sublist be considered meaningless even though it isn't quite.

## Can we have a better dataset?

After we get the general gist of what we're dealing with, we might release a second dataset which does provide subreddit names. For those of you that don't want to wait, we recommend that you create your own dataset (through data mining or simulation) and share it with others to experiment with. If you manage to create a convincing dataset, we may well just promote your version instead.