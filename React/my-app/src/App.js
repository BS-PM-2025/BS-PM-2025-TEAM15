//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Wel from "./Pages/Wel";
import Requestsubmissions_student from "./Pages/Requestsubmissions_student";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/sidebar";


import React, { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/user/")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>First User</h1>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Type:</strong> {user.type}</p>
        </div>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}



function App2() {
  return (
    <Router>
    <div class="layout">
      <div className="app-wrapper">
        <div className="content-wrapper">
          <Sidebar className="sidebar" />
          <div className="main-content">
            <Routes>
              <Route path="/Home" element={<Home />} />
              <Route path="/Wel" element={<Wel />} />
              <Route path="/Requestsubmissions_student" element={<Requestsubmissions_student />} />
            </Routes>
          </div>
        </div>
      </div>
      </div>
    </Router>
  );
}

export default App;