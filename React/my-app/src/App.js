import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Wel from "./Pages/Wel";
import Requestsubmissions_student from "./Pages/Requestsubmissions_student";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/sidebar"

function App() {
  
  return (
  //   <Router>
  //     <div className="app-layout">
  //       <Sidebar /> 
  //       <div className="main-content">
  //         <Navbar />
  //         <Routes>
  //           <Route path="/Home" element={<Home />} />
  //           <Route path="/Wel" element={<Wel />} />
  //           <Route path="/Requestsubmissions_student" element={<Requestsubmissions_student />} />
  //         </Routes>
  //       </div>
  //     </div>
  //   </Router>
  // );
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