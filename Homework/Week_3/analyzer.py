import nltk


class Analyzer():
    """Implements sentiment analysis."""

    def __init__(self, positives, negatives):
        """Initialize Analyzer."""

        # opens files for positive words and negative words and stores them in list
        self.positive = set()
        self.negative = set()

        file = open(positives, "r")
        for line in file:
            if not line.startswith(";"):
                self.positive.add(line.rstrip("\n"))
        file.close()

        file = open(negatives, "r")
        for line in file:
            if not line.startswith(";"):
                self.negative.add(line.rstrip("\n"))
        file.close()

    def analyze(self, text):
        """Analyze text for sentiment, returning its score."""

        # compares every word in text with the list of positive and negative
        sentimentscore = 0

        #word = []
        #word = text.split()
        tokenizer = nltk.tokenize.TweetTokenizer()
        word = tokenizer.tokenize(text)

        # scores every word
        for i in range(len(word)):
            if word[i].lower() in self.positive:
                sentimentscore += 1
            if word[i].lower() in self.negative:
                sentimentscore -= 1

        return sentimentscore
