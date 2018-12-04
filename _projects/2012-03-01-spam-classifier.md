---
title: "Spam Classifier"
collection: projects
permalink: /projects/2012-03-01-spam-classifier
type: "Minor Project"
venue: "Delhi Technological University"
date: 01-03-2012
location: "New Delhi, India"
---

This project tries to classify an incoming email as spam or ham using a Naive Bayes Classifier. The algorithm that we have used gives a strong baseline for the task. Infact many email clients use some variation of this algorithm for detecting spam emails.

The reason that the Naive Bayes performs so well for the task is that statistically certain words appear more frequently in a spam email than in a normal email. For instance a word like 'Replica' is more probable to be found in a spam email than in a ham email. The algorithm relies on training data in order to learn this distribution over words. How accurately your algorithm learns this distribution depends on the amount of training data you have. It is necessary that training set have enough samples covering a lot of vocabulary to give a good representation for both the classes (spam/ham). 

We used a dataset with equal number of spam and ham emails. Using the training data we learned the likelihood of a word being present in a spam or ham. Since we had equal number of training samples for spam and ham so the prior probability of an unseen incoming email being a spam was 0.5. With this knowledge we applied the Bayes theorem to calculate the posterior probability of an email being a spam given the words that are present in it. 


For more details about Naive Bayes Classifiers check this [link](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering)

