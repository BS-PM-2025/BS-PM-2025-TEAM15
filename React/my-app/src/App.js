import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Wel from "./Pages/Wel";
import Requestsubmissions_student from "./Pages/Requestsubmissions_student";
import Navbar from "./Components/Navbar";
import LoginPage from "./Pages/LoginPage";
import Sidebar from "./Components/sidebar";
import Layout from "./Components/layout";


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
          <Route path="/Requestsubmissions_student" element={<Requestsubmissions_student />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;