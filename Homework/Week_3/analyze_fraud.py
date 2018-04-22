import nltk


class AnalyzerFraud():
    """Implements sentiment analysis."""

    def __init__(self):
        """Initialize Analyzer."""

        # opens files for positive words and negative words and stores them in list
        self.fraudo = set()
        # self.negative = set()

        self.fraudo = (["fraud", "malfeasance", "bankruptcy", "scandal", "audit",
         "loopholes", "ignore", "lawsuit", "debt", "sentence", "sentenced", "illegal",
         "destroying", "altering", "fabricating", "audit", "conflict of interest",
         "ethics", "ethical", "strange transactions", "concerns", "trial", "indictment",
         "laundering", "justice", "crisis"])

        # file = open(positives, "r")
        # for line in file:
        #     if not line.startswith(";"):
        #         self.positive.add(line.rstrip("\n"))
        # file.close()

        # file = open(negatives, "r")
        # for line in file:
        #     if not line.startswith(";"):
        #         self.negative.add(line.rstrip("\n"))
        # file.close()

    def analyze_fraud(self, text):
        """Analyze text for sentiment, returning its score."""

        # compares every word in text with the list of positive and negative
        fraudscore = 0

        #word = []
        #word = text.split()
        tokenizer = nltk.tokenize.TweetTokenizer()
        word = tokenizer.tokenize(text)

        # scores every word
        for i in range(len(word)):
            if word[i].lower() in self.fraudo:
                fraudscore += 1

        return fraudscore
