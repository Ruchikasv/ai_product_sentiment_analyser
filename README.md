# ai_product_sentiment_analyser
Full-stack AI product review analysis platform featuring sentiment analysis, review insights, suspicious review detection, AI summaries, and local LLM integration with Ollama.

# AI Product Review Analyzer

An AI-powered product review analysis platform built using React, Flask, SQLite, TextBlob, and Ollama.

## Features

### 📊 Sentiment Analysis

* Automatically classifies reviews as:

  * Positive 😊
  * Negative 😡
  * Neutral 😐
  * Suspicious 🚨

### 🤖 AI Review Summary

* Generates concise AI-powered summaries for each product.
* Provides:

  * 5 key review highlights
  * 1 final verdict

### 💬 AI Chatbot

* Ask questions about product reviews.
* Example questions:

  * What do customers like most?
  * What are the biggest complaints?
  * Should I buy this product?

### 📈 AI Insights

* Generates:

  * Top strengths
  * Top complaints
  * Suspicious review observations
  * Recommendation score

### 🚨 Suspicious Review Detection

* Identifies potentially fake or promotional reviews.
* Displays suspicious reviews separately in analytics.

### 📁 CSV Upload

* Bulk import reviews from CSV files.

### 📥 CSV Export

* Export analyzed review data.

### 🏆 Top Products

* Displays highest-rated products based on sentiment scores.

### 📊 Dashboard Analytics

* Review statistics
* Sentiment distribution chart
* Product insights

---

# Tech Stack

Frontend:

* React
* Axios
* Tailwind CSS
* Chart.js

Backend:

* Flask
* SQLite
* TextBlob
* Ollama

AI Model:

* Llama 3.2 (1B)

---

# Installation

## Clone Repository

```bash
git clone <your-repository-url>
cd ai_product_sentiment_analyser
```

---

## Backend Setup

Navigate to backend folder:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate virtual environment:

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:
these ll take time please wait....
```bash
pip install flask
pip install flask-cors
pip install textblob
pip install pandas
pip install ollama
```

Run backend:

```bash
python app.py
```

Backend runs on:

```text
http://127.0.0.1:5000
```

---

## Ollama Setup

Install Ollama:

https://ollama.com

Pull model:
**compulsoryyyy**
```bash
ollama pull llama3.2:1b
```

Verify installation:

```bash
ollama list
```

Start Ollama server:
may not work
```bash
ollama serve
```

---

## Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```
ignore audit issues
Install required packages:

```bash
npm install axios
npm install chart.js react-chartjs-2
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Project Workflow

1. Add reviews manually or upload CSV.
2. Reviews are analyzed using TextBlob.
3. Sentiment is stored in SQLite.
4. Dashboard updates automatically.
5. AI Summary generates product overview.
6. AI Chatbot answers review-related questions.
7. AI Insights provide strengths, complaints, and recommendations.

---

# Future Enhancements

* PDF report generation
* Product comparison dashboard
* Advanced fake review detection using LLMs
* Recommendation scoring system

---

# Author

Ruchika S V

© 2026 All Rights Reserved
