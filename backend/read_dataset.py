import pandas as pd

df = pd.read_csv("../dataset/flipkart_reviews.csv", encoding="latin1")

print("Total Reviews:", len(df))