import sqlite3

conn = sqlite3.connect("reviews.db")

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT,
    review TEXT,
    sentiment TEXT,
    score REAL
)
""")

conn.commit()
conn.close()

print("Database created!")