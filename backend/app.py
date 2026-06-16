from random import sample
from urllib import response
import os
from flask import Flask, request, send_file
import sqlite3
from sentiment import analyze_sentiment
from flask_cors import CORS
import pandas as pd
from ollama import chat


# load_dotenv()
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# genai.configure(api_key="GEMINI_API_KEY")
# model = genai.GenerativeModel("gemini-pro")

app = Flask(__name__)
CORS(app)
@app.route('/')
def home():
    return "Backend is running!"

@app.route('/analyze')
def analyze():
    review = request.args.get('review')

    score, sentiment = analyze_sentiment(review)

    return {
        "review": review,
        "score": score,
        "sentiment": sentiment
    }
@app.route('/reviews')
def get_reviews():

    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT product_name, review, sentiment, score
    FROM reviews
    LIMIT 10
    """)

    rows = cursor.fetchall()

    conn.close()

    return {
        "reviews": rows
    }
    
@app.route('/stats')
def get_stats():

    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM reviews")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM reviews WHERE sentiment='Positive'")
    positive = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM reviews WHERE sentiment='Negative'")
    negative = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM reviews WHERE sentiment='Neutral'")
    neutral = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM reviews WHERE sentiment='Suspicious'")
    suspicious = cursor.fetchone()[0]

    conn.close()

    return {
        "total": total,
        "positive": positive,
        "negative": negative,
        "neutral": neutral,
        "suspicious": suspicious
    }
    
@app.route('/products')
def get_products():

    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT DISTINCT product_name
    FROM reviews
    LIMIT 20
    """)

    rows = cursor.fetchall()

    conn.close()

    products = [row[0] for row in rows]

    return {
        "products": products
    }
    
@app.route('/product_reviews')
def get_product_reviews():

    product_name = request.args.get("product")
    
    if not product_name:
        return {"reviews": []}


    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT review, sentiment, score
    FROM reviews
    WHERE product_name LIKE ?
    LIMIT 20
    """, (f"%{product_name}%",))

    rows = cursor.fetchall()

    conn.close()

    reviews = []

    for row in rows:
        reviews.append({
            "review": row[0],
            "sentiment": row[1],
            "score": row[2]
        })

    return {
        "reviews": reviews
    }
    
@app.route('/all_reviews')
def all_reviews():

    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT review, sentiment, score
    FROM reviews
    LIMIT 10
    """)

    rows = cursor.fetchall()

    conn.close()

    return {
        "reviews": rows
    }
    
@app.route('/add_review', methods=['POST'])
def add_review():

    data = request.json

    product_name = data["product_name"]
    review = data["review"]

    score, sentiment = analyze_sentiment(review)

    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO reviews(product_name, review, sentiment, score)
    VALUES (?, ?, ?, ?)
    """, (product_name, review, sentiment, score))

    conn.commit()
    conn.close()

    return {
        "product_name": product_name,
        "review": review,
        "sentiment": sentiment,
        "score": score
    }
    
@app.route('/upload_csv', methods=['POST'])
def upload_csv():

    file = request.files['file']

    
    df = pd.read_csv(file, encoding='latin1')
    
    for col in df.columns:
        print("\nCOLUMN:", col)

        sample = (
        df[col]
        .astype(str)
        .head(5)
        .tolist()
    )

    print(sample)
    
    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    imported = 0

    print(df.columns.tolist())
    product_col = None
    review_col = None

    longest_column = 0
    shortest_column = 999999
    best_product_length = 0

    for col in df.columns:
        if "product" in col.lower():
            product_col = col
        sample = (
            df[col]
            .astype(str)
            .head(20)
            .tolist()
    )

        avg_length = sum(len(x) for x in sample) / len(sample)

        print(col, avg_length)
        sample = (
        df[col]
        .astype(str)
        .head(5)
        .tolist()
)
        unique_values = len(set(sample))
        if (
            avg_length > 15
            and avg_length < 50
            and unique_values <= 2
        ):
            if avg_length > best_product_length:
                best_product_length = avg_length
                product_col = col
        print("Unique:", unique_values)
        
        print(sample)
        
        
        if avg_length > longest_column:
            longest_column = avg_length
            review_col = col

    print("Detected Product:", product_col)
    print("Detected Review:", review_col)
    for _, row in df.iterrows():
    
        review = str(row[review_col])
        product_name = str(row[product_col])

        score, sentiment = analyze_sentiment(review)

        cursor.execute("""
        INSERT INTO reviews(product_name, review, sentiment, score)
        VALUES (?, ?, ?, ?)
        """, (product_name, review, sentiment, score))

        imported += 1

    conn.commit()
    conn.close()

    return {
        "imported": imported
    }
  
@app.route('/top_products')
def top_products():

    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT
        product_name,
        ROUND(AVG(score), 2) as avg_score,
        COUNT(*) as reviews_count
    FROM reviews
    GROUP BY product_name
    HAVING COUNT(*) >= 2
    ORDER BY avg_score DESC
    LIMIT 5
    """)

    rows = cursor.fetchall()

    conn.close()

    products = []

    for row in rows:
        products.append({
            "product": row[0],
            "score": row[1],
            "reviews": row[2]
        })

    return {
        "products": products
    }
   
@app.route('/export_csv')
def export_csv():

    conn = sqlite3.connect("reviews.db")

    df = pd.read_sql_query("""
    SELECT product_name, review, sentiment, score
    FROM reviews
    """, conn)

    conn.close()

    df.to_csv("report.csv", index=False)

    return send_file(
        "report.csv",
        as_attachment=True
    )
    
@app.route('/delete_product', methods=['POST'])
def delete_product():

    data = request.json
    product = data["product"]

    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("""
    DELETE FROM reviews
    WHERE product_name = ?
    """, (product,))

    conn.commit()
    conn.close()

    return {
        "message": "Product deleted"
    }
    
@app.route('/ai_summary', methods=['POST'])
def ai_summary():

    data = request.json
    product = data["product"]

    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT review
    FROM reviews
    WHERE product_name = ?
    LIMIT 30
    """, (product,))

    reviews = cursor.fetchall()

    conn.close()

    review_text = "\n".join(
        [r[0] for r in reviews]
    )

    prompt = f"""
Analyze these reviews.

Give EXACTLY:

- 5 short bullet points
- 1 Final Verdict line

Keep it under 100 words.

Reviews:
{review_text}
"""

    response = chat(
        model='llama3.2:1b',
        messages=[
            {
                'role': 'user',
                'content': prompt
            }
        ]
    )

    return {
        "summary":
        response["message"]["content"]
    }
    
@app.route('/ask_ai', methods=['POST'])
def ask_ai():

    data = request.json

    product = data["product"]
    question = data["question"]

    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT review
        FROM reviews
        WHERE product_name = ?
        LIMIT 30
    """, (product,))

    reviews = cursor.fetchall()

    conn.close()

    review_text = "\n".join(
        [r[0] for r in reviews]
    )

    prompt = f"""
You are a product review analyst.

Answer the user's question in 2-3 short sentences.

Question:
{question}

Reviews:
{review_text}

Rules:
- Do not quote raw reviews.
- Do not repeat the reviews.
- Give a concise answer.
- If there is not enough data, simply say:
  'Not enough review data available.'
"""
    if "insight" in question.lower():
    
        prompt = f"""
Analyze these reviews.

Format:

Strengths:
• point
• point
• point

Complaints:
• point
• point
• point

Suspicious:
• point

Score:
X/10

Maximum 60 words.

Reviews:
{review_text}
"""

    response = chat(
        model='llama3.2:1b',
        messages=[
            {
                'role': 'user',
                'content': prompt
            }
        ]
    )
    print(response["message"]["content"])
    return {
        "answer": response["message"]["content"]
        
    }
    
 
    
if __name__ == '__main__':
    app.run(debug=True)