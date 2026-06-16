from textblob import TextBlob

def analyze_sentiment(review):
    analysis = TextBlob(review)
    score = analysis.sentiment.polarity
    if detect_suspicious(review):
        sentiment = "Suspicious"
    elif score > 0:
        sentiment = "Positive"
    elif score < 0:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
        
    return score, sentiment
def detect_suspicious(review):
    
    review = review.lower()

    suspicious_words = [
        "best product ever",
        "must buy",
        "100% recommended",
        "life changing",
        "buy now",
        "perfect product"
    ]

    for word in suspicious_words:
        if word in review:
            return True

    if len(set(review.split())) < len(review.split()) * 0.5:
        return True

    return False

# print(analyze_sentiment("Best product ever! Must buy!"))