import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend,
} from "chart.js";

ChartJS.register(
ArcElement,
Tooltip,
Legend
);

function App() {

const askAI = (product) => {

  setLoadingChat({
  ...loadingChat,
  [product]: true,
});

console.log(product);
console.log(questions);

  if (!product || !questions[product]){

setLoadingChat({
  ...loadingChat,
  [product]: false,
});

    console.log("enter a question");
    return;
  }

  axios
    .post("http://127.0.0.1:5000/ask_ai", {
      product: product,
      question: questions[product]
    })
    .then((response) => {
      console.log("FULL RESPONSE", response.data);
      console.log(response.data);
      setAnswers({
  ...answers,
  [product]: response.data.answer,
});
setLoadingChat({
  ...loadingChat,
  [product]: false,
});
      setChatProduct(product);
    })
    .catch((error) => {
      console.log(error);
      setLoadingChat({
        ...loadingChat,
        [product]: false,
      });

  setMessage("❌ AI failed to respond. Please try again.");
    });

};

const generateSummary = (product) => {
setSummaryProduct(product);
  setLoadingSummary(true);

  axios
    .post("http://127.0.0.1:5000/ai_summary", {
      product: product
    })
    .then((response) => {
      setAiSummary(response.data.summary);
      setLoadingSummary(false);
    })
    .catch((error) => {

      console.log(error);

      setLoadingSummary(false);

    });

};

const [stats, setStats] = useState({
total: 0,
positive: 0,
negative: 0,
neutral: 0,
});

const [products, setProducts] = useState([]);
const [topProducts, setTopProducts] = useState([]);
const [reviews, setReviews] = useState([]);
const [loadingSummary, setLoadingSummary] = useState(false);
const [aiSummary, setAiSummary] = useState("");
const [summaryProduct, setSummaryProduct] = useState("");
const [selectedProduct, setSelectedProduct] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [newProduct, setNewProduct] = useState("");
const [newReview, setNewReview] = useState("");
const [chatProduct, setChatProduct] = useState("");
const [questions, setQuestions] = useState({});
const [answers, setAnswers] = useState({});
const [loadingChat, setLoadingChat] = useState({});
const [csvFile, setCsvFile] = useState(null);

const [message, setMessage] = useState("");
console.log(message);
useEffect(() => {
axios
.get("http://127.0.0.1:5000/stats")
.then((response) => {
setStats(response.data);
})
.catch((error) => {
console.log(error);
});
axios
    .get("http://127.0.0.1:5000/products")
    .then((response) => {
      setProducts(response.data.products);
    })
    .catch((error) => {
      console.log(error);
    });

axios
  .get("http://127.0.0.1:5000/top_products")
  .then((response) => {
    setTopProducts(response.data.products);
  })
  .catch((error) => {
    console.log(error);
  });

axios
  .get("http://127.0.0.1:5000/all_reviews")
  .then((response) => {
    setReviews(response.data.reviews);
  })
  .catch((error) => {
    console.log(error);
  });


}, []);

useEffect(() => {
  if (!message) return;

  const timer = setTimeout(() => {
    setMessage("");
  }, 3000);

  return () => clearTimeout(timer);
}, [message]);


useEffect(() => {

  if (!selectedProduct) return;

  axios
    .get("http://127.0.0.1:5000/product_reviews", {
      params: {
        product: selectedProduct,
      },
    })
    .then((response) => {
      setReviews(response.data.reviews);
    })
    .catch((error) => {
      console.log(error);
    });

}, [selectedProduct]);


const chartData = {
labels: ["Positive", "Negative", "Neutral","Suspicious"],
datasets: [
{
data: [
stats.positive,
stats.negative,
stats.neutral,
stats.suspicious
],
backgroundColor: [
"#22c55e",
"#ef4444",
"#eab308",
"#b155f7",
],
borderWidth: 0,
},
],
};

return ( <div className="min-h-screen bg-black text-white"> <div className="p-8">


    <div className="flex justify-between items-start">

  <div>
    <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
      AI Product Review Analyzer 
    </h1>

    <p className="text-gray-400 mt-3 text-lg">
      Analyze customer feedback with AI-powered insights, sentiment analysis, and suspicious review detection.
    </p>
  </div>

  <button
    onClick={() =>
      window.open(
        "http://127.0.0.1:5000/export_csv",
        "_blank"
      )
    }
    className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold"
  >
    📥 Export Report
  </button>

</div>

    

{message && (
  <div className="mt-4 bg-green-500/20 text-green-400 border border-green-500 rounded-xl p-4">
    {message}
  </div>
)}

    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-10">

      <div className="bg-zinc-900/60 backdrop-blur-lg rounded-3xl p-6 border border-zinc-700 hover:scale-105 transition-all duration-300 shadow-xl">
        <h2 className="text-gray-400">Total Reviews📝</h2>
        <p className="text-4xl font-bold mt-2">{stats.total}</p>
      </div>

      <div className="bg-zinc-900/60 backdrop-blur-lg rounded-3xl p-6 border border-zinc-700 hover:scale-105 transition-all duration-300 shadow-xl">
        <h2 className="text-gray-400">Positive 😊</h2>
        <p className="text-4xl font-bold text-green-400 mt-2">
          {stats.positive}
        </p>
      </div>

      <div className="bg-zinc-900/60 backdrop-blur-lg rounded-3xl p-6 border border-zinc-700 hover:scale-105 transition-all duration-300 shadow-xl">
        <h2 className="text-gray-400">Negative 😡</h2>
        <p className="text-4xl font-bold text-red-400 mt-2">
          {stats.negative}
        </p>
      </div>

      <div className="bg-zinc-900/60 backdrop-blur-lg rounded-3xl p-6 border border-zinc-700 hover:scale-105 transition-all duration-300 shadow-xl">
        <h2 className="text-gray-400">Neutral 😐</h2>
        <p className="text-4xl font-bold text-yellow-400 mt-2">
          {stats.neutral}
        </p>
      </div>

      <div className="bg-zinc-900/60 backdrop-blur-lg rounded-3xl p-6 border border-zinc-700 hover:scale-105 transition-all duration-300 shadow-xl">
  <h2 className="text-gray-400">Suspicious 🚨</h2>

  <p className="text-4xl font-bold text-purple-400 mt-2">
    {stats.suspicious}
  </p>
</div>
    </div>

    <div className="mt-12 bg-zinc-900/60 backdrop-blur-lg rounded-3xl p-8 border border-zinc-700 shadow-xl">

      <h2 className="text-2xl font-bold mb-6">
        Sentiment Distribution
      </h2>

      <div className="w-[400px] mx-auto">
        <Pie data={chartData} />
      </div>

      <div className="mt-6 text-center space-y-2">

        <p className="text-green-400 text-lg font-semibold">
          Positive: {stats.total
            ? ((stats.positive / stats.total) * 100).toFixed(1)
            : 0}%
        </p>

        <p className="text-red-400 text-lg font-semibold">
          Negative: {stats.total
            ? ((stats.negative / stats.total) * 100).toFixed(1)
            : 0}%
        </p>

        <p className="text-yellow-400 text-lg font-semibold">
          Neutral: {stats.total
            ? ((stats.neutral / stats.total) * 100).toFixed(1)
            : 0}%
        </p>

<p className="text-purple-400 text-lg font-semibold">
  🚨 Suspicious: {stats.total
    ? ((stats.suspicious / stats.total) * 100).toFixed(1)
    : 0}%
</p>

      </div>

    </div>

<div className="mt-12 bg-zinc-900/60 backdrop-blur-lg rounded-3xl p-6 border border-zinc-700">

  <h2 className="text-3xl font-bold mb-6">
    Analyze New Review
  </h2>

  <input
    type="text"
    placeholder="Product Name"
    value={newProduct}
    onChange={(e) => setNewProduct(e.target.value)}
    className="w-full p-3 rounded-xl bg-zinc-800 mb-4"
  />

  <textarea
    placeholder="Write a review..."
    value={newReview}
    onChange={(e) => setNewReview(e.target.value)}
    className="w-full p-3 rounded-xl bg-zinc-800 h-32"
  />

<button
  onClick={() => {
    axios
      .post("http://127.0.0.1:5000/add_review", {
        product_name: newProduct,
        review: newReview,
      })
     .then((response) => {
  console.log(response.data);

  setMessage("✅ Review Added Successfully!");

  setNewProduct("");
  setNewReview("");

  axios
    .get("http://127.0.0.1:5000/stats")
    .then((response) => {
      setStats(response.data);
    });

  axios
    .get("http://127.0.0.1:5000/products")
    .then((response) => {
      setProducts(response.data.products);
    });

  axios
    .get("http://127.0.0.1:5000/all_reviews")
    .then((response) => {
      setReviews(response.data.reviews);
    });
})
      .catch((error) => {
        console.log(error);
      });
  }}
  className="mt-4 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold"
>
  Analyze & Save
</button>

<div className="mt-6">
  <input
    type="file"
    accept=".csv"
    onChange={(e) => setCsvFile(e.target.files[0])}
    className="w-full p-3 rounded-xl bg-zinc-800"
  />
  <button
  onClick={() => {
    const formData = new FormData();
    formData.append("file", csvFile);

    axios
      .post("http://127.0.0.1:5000/upload_csv", formData)
      .then((response) => {
        setMessage(`✅ ${response.data.imported} reviews imported successfully!`);
  console.log(response.data);

  axios
    .get("http://127.0.0.1:5000/stats")
    .then((response) => {
      setStats(response.data);
    });

    axios
  .get("http://127.0.0.1:5000/products")
  .then((response) => {
    setProducts(response.data.products);
  });
})
      
      .catch((error) => {
        console.log(error);
      });
  }}
  className="mt-4 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-semibold"
>
  Upload CSV
</button>
</div>



</div>

    
    <div className="mt-12 mb-12">
  <h2 className="text-3xl font-bold mb-6">
    🏆 Top Products
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {topProducts.map((product, index) => (
      <div
        key={index}
        className="bg-zinc-900/60 backdrop-blur-lg rounded-3xl p-6 border border-zinc-700 shadow-xl"
      >
        <p className="text-yellow-400 text-xl font-bold mb-2">
          #{index + 1}
        </p>

        <p className="text-gray-300 mb-2">
          {product.product}
        </p>

        <p className="text-green-400">
          Avg Score: {product.score}
        </p>

        <p className="text-gray-400">
          Reviews📝: {product.reviews}
        </p>
        {reviews.length === 0 && (
  <p className="text-center text-gray-500 py-8">
    📝 No reviews found
  </p>
)}
      </div>
    ))}
  </div>
</div>

<div className="mt-12">
  
  <h2 className="text-3xl font-bold mb-6">
    Products
  </h2>
{products.length === 0 && (
  <p className="text-center text-gray-500 py-8">
    📦 No products available
  </p>
)}
  <input
    type="text"
    placeholder="🔍 Search Product..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full p-3 rounded-xl bg-zinc-800 mb-6"
  />

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {products
      .filter((product) =>
        product.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((product, index) => (
        <div
          key={index}
          onClick={() => setSelectedProduct(product)}
          className="cursor-pointer bg-zinc-900/60 backdrop-blur-lg rounded-3xl p-6 border border-zinc-700 hover:border-cyan-400 hover:scale-105 transition-all duration-300 shadow-xl"
        >
          <div>
            <p className="text-cyan-400 text-xl mb-2">
              📦 Product
            </p>

            <p className="text-gray-300">
              {product}
            </p>
            <button
  onClick={(e) => {
    e.stopPropagation();

    axios
      .post("http://127.0.0.1:5000/delete_product", {
        product: product,
      })
      .then(() => {
        setMessage("🗑 Product Deleted Successfully!");
        setSelectedProduct("");

        axios
          .get("http://127.0.0.1:5000/products")
          .then((response) => {
            setProducts(response.data.products);
          });

        axios
          .get("http://127.0.0.1:5000/stats")
          .then((response) => {
            setStats(response.data);
          });

          

        axios
          .get("http://127.0.0.1:5000/all_reviews")
          .then((response) => {
            setReviews(response.data.reviews);
          });
      });
  }}
  className="mt-3 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
>
  🗑 Delete
</button>
<button
  onClick={() => generateSummary(product)
    
  }

  className="ml-3 bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-xl"
>
  ✨ Generate AI Summary
</button>
{summaryProduct === product && (
  <div className="mt-4 bg-zinc-800 p-4 rounded-xl border border-cyan-500">

    {loadingSummary ? (
      <p className="text-cyan-400 animate-pulse">
        ⏳ Generating summary... (~1 min)
      </p>
    ) : (
      <>
        <h3 className="font-bold mb-2">
          🤖 AI Summary
        </h3>

        <pre className="whitespace-pre-wrap text-sm">
          {aiSummary}
        </pre>
      </>
    )}

  </div>
)}

<div className="mt-6 bg-zinc-900 p-6 rounded-xl border border-zinc-700">

  <h2 className="text-2xl font-bold mb-4">
    💬 Ask AI About Reviews
  </h2>

  <input
    type="text"
    placeholder="Why do customers dislike this product?"
    value={questions[product] || ""}
onChange={(e) =>
  setQuestions({
    ...questions,
    [product]: e.target.value,
  })
}
    className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-600"
  />

  <button
  
    onClick={()=>askAI(product)}
    disabled={loadingChat[product]}
    className="mt-3 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-xl animate-pulse font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    
  >
    {loadingChat[product]
    ?"⏳ Thinking..."
    : "Ask AI"}
  </button>

  {answers[product] && (
    <div className="mt-4 bg-zinc-800 p-4 rounded-xl border border-purple-500 shadow-lg">
        <h4 className="font-bold text-purple-400 mb-2">
  🤖 AI Assistant
</h4>
      <p className="mt-2 whitespace-pre-wrap text-sm">{answers[product]}</p>
    </div>
  )}

</div>

          </div>
        </div>
        
      ))}

  </div>
</div>

<div className="mt-12">
  <h2 className="text-3xl font-bold mb-6">
  {selectedProduct
    ? `Reviews for ${selectedProduct}`
    : "Recent Reviews"}
</h2>

{selectedProduct && (
  <p className="text-cyan-400 mb-4">
    Selected Product: {selectedProduct}
  </p>
)}

  <div className="space-y-4">

    {reviews.map((review, index) => (

      <div
        key={index}
        className="bg-zinc-900/60 backdrop-blur-lg rounded-3xl p-5 border border-zinc-700 shadow-xl"
      >

        <div className="flex justify-between items-center mb-3">

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold
            ${
              review.sentiment === "Positive"
                ? "bg-green-500/20 text-green-400"
                : review.sentiment === "Negative"
                ? "bg-red-500/20 text-red-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {review.sentiment}
          </span>

          <span className="text-gray-400">
            Score: {Number(review.score || 0).toFixed(2)}
          </span>

        </div>

        <p className="text-gray-300">
          {review.review}
        </p>

      </div>

    ))}

  </div>
</div>

  </div>
    
  <footer className="mt-16 border-t border-zinc-700 py-8 text-center">
  <h3 className="text-cyan-400 font-semibold">
    AI Product Review Analyzer
  </h3>

  <p className="text-gray-400 mt-2 text-sm">
    Built by Ruchika S V
  </p>

  <p className="text-gray-500 text-xs mt-1">
    © 2026 All Rights Reserved
  </p>

  <p className="text-gray-600 text-xs mt-3">
    Powered by React • Flask • SQLite • TextBlob • Ollama AI
  </p>
</footer>
</div>


);
}

export default App;
