import React, { useState, useEffect } from "react"; // 🛠 Fix!

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Wel from "./Pages/Wel";
import StudentLookup from "./Pages/StudentLookup";
import Viewasks_admin from "./Pages/Viewasks_admin";
import Requestsubmissions_student from "./Pages/Requestsubmissions_student";

import StudentStatusRequest from "./Pages/student_status_request";

import Navbar from "./Components/Navbar";
import Sidebar from "./Components/sidebar";
import Layout from "./Components/layout";
import LoginPage from "./Pages/LoginPage";



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
  {/* Check this current conflict when merging with the main */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        
        {/* Layout routes */}
        <Route element={<Layout />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/Wel" element={<Wel />} />
          <Route path="/asks" element={<Viewasks_admin />} />
          <Route path="/studentlookup" element={<StudentLookup />}/>
          <Route path="/Requestsubmissions_student" element={<Requestsubmissions_student />} />
          <Route path="/Student_status_request" element={<StudentStatusRequest />} />
          
        </Route>
        </Routes>
</Router>
    
  );
}

export default App;