import pandas as pd
import sqlite3
from sentiment import analyze_sentiment

# Read dataset
df = pd.read_csv("../dataset/flipkart_reviews.csv", encoding="latin1")

# Take first 1000 reviews
df = df.head(1000)

# Connect database
conn = sqlite3.connect("reviews.db")
cursor = conn.cursor()

for _, row in df.iterrows():

    review = str(row["Summary"])
    product_name = str(row["ProductName"])

    score, sentiment = analyze_sentiment(review)

    cursor.execute("""
    INSERT INTO reviews(product_name, review, sentiment, score)
    VALUES (?, ?, ?, ?)
    """, (product_name, review, sentiment, score))

conn.commit()
conn.close()

print("1000 reviews imported successfully!")