import sqlite3

conn = sqlite3.connect("reviews.db")
cursor = conn.cursor()

cursor.execute("SELECT COUNT(*) FROM reviews")

count = cursor.fetchone()[0]

print("Total Records:", count)

conn.close()