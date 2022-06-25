---
title: "Multi-Domain Dialogue State Tracking"
collection: talks
type: "Talk"
permalink: /talks/2020-03-18-multi-domain-dialogue-state-tracking
venue: "Ebot7 GmbH"
date: 2020-03-18
location: "Munich, Germany"
---

Last summer our team of data scientists attended the 57th Annual Meeting of the Association for Computational Linguistics (ACL) at Florence. It was a great learning and team bonding experience for all of us. During the conference we learned about this really interesting paper - [Transferable Multi-Domain State Generator for Task-Oriented Dialogue Systems](https://arxiv.org/abs/1905.08743). It received two awards in the conference, an outstanding paper award the best paper award at NLP for Conversational AI Workshop.

Currently at ebot7 we are building a system (which we call Conversational Engine) for managing conversations by keeping track of dialog states and then deciding which action to take based on the current state and context. To this end we wanted to do a small proof of concept on the above mentioned paper and through this blog we will share our findings. In this first post we want to share an intuitive and detailed explanation of the proposed architecture.

The main goal of Dialog State Tracking (DST) is to extract information from dialogs which will enable a dialog system to appropriately manage conversations. For instance, in task oriented systems, such as ticket booking, it is essential to gather information about departure location, departure time, destination etc to better understand a user’s intention and then take appropriate action or collect more information. The job of DST is to extract this information and this extracted information is what defines the state of a dialog. We can use different formalization to represent a state eg. it can either   be represented in the form of a list of (domain, slot, value) tuples or we can use a compact version where we convert these tuples into vectors.

[For more details read this report](https://dugarsumit.github.io/files/multi_domain_dialogue_state_tracking.pdf)
