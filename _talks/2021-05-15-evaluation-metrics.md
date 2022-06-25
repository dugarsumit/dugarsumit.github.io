---
title: "An overview of NLP evaluation metrics and distance/similarity measures"
collection: talks
type: "Free Friday Talk"
permalink: /talks/2021-05-15-evaluation-metrics
venue: "Ebot7 GmbH"
date: 2021-05-15
location: "Munich, Germany"
---

Evaluation in NLP is an open problem especially when it comes to the evaluation of generated text. It's a really hard problem and therefore there is no single go to evaluation metric available. What makes this problem even more hard is that metrics need to evaluate competing goals i.e Correctness (quality)/Specicity (diversity).

How can you evaluate a model.

1. Indirect-Evaluation - Incorporate your NLP model into some other downstream task that can be easily evaluaed.
2. Direct Evaluation
    1. Human Evaluation
    2. Automatic Evaluation - Generate some objective scores using ground truths and an evalation metric. 

Then the question is which metric to use in which case. And the best way to answer this questions is to first answer the question - what are we trying to measure?

[For more details read this report](https://dugarsumit.github.io/files/evaluation_metrics_and_distance_similarity_measures.pdf)
