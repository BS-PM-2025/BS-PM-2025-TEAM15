import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8000/wel/";

function Wel() {
  const [details, setDetails] = useState([]);
  const [user, setUser] = useState("");
  const [quote, setQuote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = () => {
    axios
      .get(BASE_URL)
      .then((res) => setDetails(res.data))
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(BASE_URL, { name: user, detail: quote })
      .then(() => {
        setUser("");
        setQuote("");
        fetchQuotes();
      });
  };

  return (
    <div className="container">
      <h2>Wel Page (Quote Form)</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control my-2"
          placeholder="Your Name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
        <textarea
          className="form-control my-2"
          placeholder="Your Quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-success">
          Submit Quote
        </button>
      </form>

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/home")}>
        Go to Home
      </button>

      <hr />
      <ul>
        {details.map((item, idx) => (
          <li key={idx}>
            <strong>{item.name}:</strong> {item.detail}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Wel;