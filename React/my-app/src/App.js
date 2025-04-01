import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Wel from "./Pages/Wel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/Wel" element={<Wel />} />
      </Routes>
    </Router>
  );
}

export default App;