---
title: "Multilingual Sentence Embeddings"
collection: projects
permalink: /projects/2022-06-15-multilingual-sentence-embeddings
type: "Personal Project"
venue: "Ebot7 GmbH"
date: 2022-06-15
location: "Munich, Germany"
---

Undertook a solo research project to implement a multilingual sentence similarity model (de,en,fr). This model performs 3% points better and has 74% smaller embeddings than the current best ebot7 model.

# Benefits

1. Makes model hosting and maintenance simpler and easier and scalable. We no longer need to host one big transformer per language. We can combine 3 to 4 languages in one model. This is similar to database sharding.
2. Since the teacher model won’t get deployed so we can also experiment with larger models (for the teacher) without being worried about the inference speed.
3. Comparatively easy to collect data for this approach
    1. The teacher model would generally be trained using English data. It's easier to find English datasets and it's also easier to get them labeled.
    2. We could also use message data for the multilingual part of the model without any manual labeling effort.
4. We can also train the multilingual step in an online fashion (basically using CTP) where the model will learn new translations from the continuous message data which might help the model to learn new client-specific words in different languages.
5. Since the model will have cross-lingual capabilities so a German bot will also understand English and French out of the box. So if someone will ask a question in English it will still be able to correctly match the English query against the German KB.
6. Maybe the same approach can also be used for unifying English and German query & context encoders in RL.
7. Saves us a lot of money on hosting and translations.

[For more details read this report](https://dugarsumit.github.io/files/multilingual_sentence_embeddings.pdf)
