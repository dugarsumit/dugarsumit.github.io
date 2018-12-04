---
title: "Text Summarization Tool"
collection: projects
permalink: /projects/2013-03-01-text-summarization
type: "Final Btech Project"
venue: "Delhi Technological University"
date: 01-03-2013
location: "New Delhi, India"
---

It is an automatic summarization tool that generates summary of a given text using linguistic, statistical and extractive methods. The algorithm for generating summary was implemened in C++ and the user interface was implemented in Visual Basic. It was a group project submitted by a group of 4 studennts in partial fulfillment of the requirement for the award of the degree of Bachelor of Technology in Software Engineering, to the Delhi Technological University in 2013.

![ATS](images/ats-tool-image.png)

Our program essentially works on the following logics:
##	Word Score
###	Primary Word Score
1.	**Stop Words** -- These are some insignificant words that are so commonly used in the English
language that no text can be created without them. They therefore provide no real idea about the
textual theme, and have therefore, been neglected while scoring sentences.
Eg. I, a, an, of, am, the, et cetera.
2.	**Cue Words** -- These are words usually used in concluding sentences of a text, making
sentences containing them crucial for any given summary. Cue Words provide closure to a given
matter, and have therefore, been given prime importance while scoring sentences.
Eg. Thus, hence, summary, conclusion, et cetera.
3.	**Basic Dictionary Words** -- 850 words of the English language have been defined as the most
frquently used words that add meaning to a sentence. These words form the backbone of our
algorithm, and have been vital in the creation of a sensible summary. We have hence, given these
words moderate importance while scoring sentences.
4.	**Proper Nouns, Numbers and abbreviations** -- Proper Nouns in most cases form the central
theme of a given text. Albeit, the identification of proper nouns without the use of linguistic
methods was difficult, we have been successful in identifying them in most cases. Proper Nouns
provide semantics to the summary, and have therefore been given high importance while scoring
sentences.

###	Final Word Score
6.	**Word Frequency** -- Once basic scores have been allotted to words, their final score is
calculated on the basis of their frequency of occurrence in the document. Words in the text which
are repeated more frequently than others contain a more profound impression of the context, and
have therefore been given a higher importance.

##	Sentence Score
1.	**Primary Score** -- Using the above methods, a final word score is calculated, and the sum of
word scores of a sentence gives a sentence score. This gives long sentence a clear advantage over
their smaller counterparts, which might not necessarily be of lesser importance.
2.	**Final Score** -- By multiplying the score so obtained by the ratio "average length / current
length" the above drawback can be nullified to a large extent, and a final sentence score is
obtained.

Sort the sentences in decending order based on their final scores and select top x number of sentences. The final list of sentences is the summary of the given text.

[More information here](https://dugarsumit.github.io/files/ATS-btech-final-proj-report.pdf)
[Source Code](https://github.com/dugarsumit/text_summarizer)