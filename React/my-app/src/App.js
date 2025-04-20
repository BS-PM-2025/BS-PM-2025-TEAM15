//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Wel from "./Pages/Wel";
import StudentLookup from "./Pages/StudentLookup";
import Viewasks_admin from "./Pages/Viewasks_admin";
import Requestsubmissions_student from "./Pages/Requestsubmissions_student";
import Navbar from "./Components/Navbar";
<<<<<<< HEAD
import LoginPage from "./Pages/LoginPage";
import Sidebar from "./Components/sidebar";
import Layout from "./Components/layout";

=======
import Sidebar from "./Components/sidebar"
import React, { useEffect, useState } from "react";
>>>>>>> origin/main

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
<<<<<<< HEAD
        </Route>
      </Routes>
    </Router>
=======
          <Route path="/Student_status_request" element={<StudentStatusRequest />} />
          
        </Routes>
      </div>
    </div>
  </div>
  </div>
</Router>
>>>>>>> origin/main
  );
}

export default App;