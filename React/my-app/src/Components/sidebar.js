import React, { useEffect,useState ,useRef } from "react";
import styles from "../App.css";
import { Link } from "react-router-dom";
import axios from "axios";






export default function Sidebar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const BASE_URL = 'http://localhost:8000/api/isadmin/';

  const toggleButtonRef = useRef(null);
  const sidebarRef = useRef(null);
  const userId = localStorage.getItem('user_id');
  const [isAdmin, setIsAdmin] = useState(null); 


  function closeAllSubMenus(e) {
    if (!e || !e.currentTarget) return; // Do nothing if null or invalid event

    const sidebar = sidebarRef.current;
    const openMenus = sidebar.querySelectorAll(".show");

    openMenus.forEach((ul) => {
      ul.classList.remove("show");
      ul.previousElementSibling.classList.remove("rotate");
    });
  }


  function toggleSidebar() {
    const sidebar = sidebarRef.current;
    const toggleButton = toggleButtonRef.current;

    sidebar.classList.toggle("close");
    toggleButton.classList.toggle("rotate");

    closeAllSubMenus();
  }
  useEffect(() => {
    if (userId) {
      axios.post(BASE_URL, { userId: userId }, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Request sent successfully:", response.data);
        setIsAdmin(response.data.is_admin); // <-- Update the state here
      })
      .catch((error) => {
        console.error("Error sending request:", error);
        setIsAdmin(false); // fallback, assume not admin if error
      });
    }
  }, [userId]); // only once when component loads

  // function toggleSubMenu(e) {
  //   const button = e.currentTarget;
  //   const submenu = button.nextElementSibling;
  //   const sidebar = sidebarRef.current;
  //   const toggleButton = toggleButtonRef.current;

  //   if (!submenu.classList.contains("show")) {
  //     closeAllSubMenus();
  //   }

  //   submenu.classList.toggle("show");
  //   button.classList.toggle("rotate");

  //   if (sidebar.classList.contains("close")) {
  //     sidebar.classList.remove("close");
  //     toggleButton.classList.toggle("rotate");
  //   }
  // }
  function toggleSubMenu(e) {
    if (!e || !e.currentTarget) return; // Do nothing if null or invalid event
  
    const button = e.currentTarget;
    const submenu = button.nextElementSibling;
    const sidebar = sidebarRef?.current;
    const toggleButton = toggleButtonRef?.current;
  
    if (!submenu?.classList.contains("show")) {
      closeAllSubMenus();
    }
  
    submenu?.classList.toggle("show");
    button.classList.toggle("rotate");
  
    if (sidebar?.classList.contains("close")) {
      sidebar.classList.remove("close");
      toggleButton?.classList.toggle("rotate");
    }
    
  }
 
  if(!isAdmin){ /*not admins sidebar! */
  return (
    <nav className="topbar">
  <ul>
    <li>
      <Link to="/Home">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="M240-200h120v-200q0-17 11.5-28.5T400-440h160q17 0 28.5 11.5T600-400v200h120v-360L480-740 240-560v360Z"/>
        </svg>
        <span>Home</span>
      </Link>
    </li>

    <li>
      <button onClick={toggleSubMenu} className="dropdown-btn" ref={toggleButtonRef}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="m221-313 142-142q12-12 28-11.5t28 12.5q11 12 11 28t-11 28L250-228q-12 12-28 12t-28-12l-86-86q-11-11-11-28t11-28q11-11 28-11t28 11l57 57Z"/>
        </svg>
        <span>Profile</span>
      </button>
      <ul className="sub-menu">
        {/* תוכן תפריט Profile אם קיים */}
      </ul>
    </li>

    <li>
      <Link to="/Student_Dashboard">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="M240-200h120v-200q0-17 11.5-28.5T400-440h160q17 0 28.5 11.5T600-400v200h120v-360L480-740 240-560v360Z"/>
        </svg>
        <span>Dashboard</span>
      </Link>
    </li>

    <li>
      <button onClick={() => setIsProfileOpen(prev => !prev)} className="dropdown-btn" ref={toggleButtonRef}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h207q16 0 30.5 6t25.5 17l57 57h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Z"/>
        </svg>
        <span>Requests</span>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="M480-361q-8 0-15-2.5t-13-8.5L268-556q-11-11-11-28t11-28q11-11 28-11t28 11l156 156 156-156q11-11 28-11t28 11q11 11 11 28t-11 28L508-372q-6 6-13 8.5t-15 2.5Z"/>
        </svg>
      </button>
      <ul className={`sub-menu ${isProfileOpen ? "show" : ""}`}>
        <li><Link to="/Requestsubmissions_student">Send request</Link></li>
        <li><a href="/Student_status_request">Student status request</a></li>
      </ul>
    </li>

    <li>
      <Link to="/exams">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="M200-80q-33 0-56.5-23.5T120-160v-640q0-33 23.5-56.5T200-880h400q17 0 28.5 11.5T640-840q0 17-11.5 28.5T600-800H200v640h560v-280q0-17 11.5-28.5T800-480q17 0 28.5 11.5T840-440v280q0 33-23.5 56.5T760-80H200Z"/>
        </svg>
        <span>Exams</span>
      </Link>
    </li>
  </ul>
</nav>
    
      );}
    
    else{ /*Admim's sidebar! */
      return (
      <div>
        
         <nav className="topbar">
    <ul>
      <li>
        {/* <button onClick={toggleSubMenu} className="dropdown-btn" ref={toggleButtonRef}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m313-480 155 156q11 11 11.5 27.5T468-268q-11 11-28 11t-28-11L228-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 27.5-11.5T468-692q11 11 11 28t-11 28L313-480Zm264 0 155 156q11 11 11.5 27.5T732-268q-11 11-28 11t-28-11L492-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 27.5-11.5T732-692q11 11 11 28t-11 28L577-480Z"/></svg>
        </button> */}
      </li>
      <li>
      <Link to="/Home">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-200h120v-200q0-17 11.5-28.5T400-440h160q17 0 28.5 11.5T600-400v200h120v-360L480-740 240-560v360Zm-80 0v-360q0-19 8.5-36t23.5-28l240-180q21-16 48-16t48 16l240 180q15 11 23.5 28t8.5 36v360q0 33-23.5 56.5T720-120H560q-17 0-28.5-11.5T520-160v-200h-80v200q0 17-11.5 28.5T400-120H240q-33 0-56.5-23.5T160-200Zm320-270Z"/></svg>
          <span>Home</span>
        </Link>
      </li>
      <li>
        <a href="profle.html">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M520-640v-160q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v160q0 17-11.5 28.5T800-600H560q-17 0-28.5-11.5T520-640ZM120-480v-320q0-17 11.5-28.5T160-840h240q17 0 28.5 11.5T440-800v320q0 17-11.5 28.5T400-440H160q-17 0-28.5-11.5T120-480Zm400 320v-320q0-17 11.5-28.5T560-520h240q17 0 28.5 11.5T840-480v320q0 17-11.5 28.5T800-120H560q-17 0-28.5-11.5T520-160Zm-400 0v-160q0-17 11.5-28.5T160-360h240q17 0 28.5 11.5T440-320v160q0 17-11.5 28.5T400-120H160q-17 0-28.5-11.5T120-160Zm80-360h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>
          <span>profile</span>
        </a>
      </li>
      
        <li>
  <Link to="/asks">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
      <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h207q16 0 30.5 6t25.5 17l57 57h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/>
    </svg>
    <span>View Requests</span>
  </Link>
</li>

<li>
  <Link to="/studentlookup">
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#e8eaed">
      <path d="M480-480Zm0 400q-66 0-124.5-25T256-256q-44-44-69-102.5T160-480q0-66 25-124.5T256-709q44-44 102.5-69T480-803q66 0 124.5 25T709-709q44 44 69 102.5T803-480q0 66-25 124.5T709-256q-44 44-102.5 69T480-80Zm0-80q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70Zm-40-120v-200l160 100-160 100Z"/>
    </svg>
    <span>Student Lookup</span>
  </Link>
</li>

      <li>
  <Link to="/professor-grade-update">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
      <path d="M480-160q-66 0-124.5-25T256-256q-44-44-69-102.5T160-480q0-66 25-124.5T256-709q44-44 102.5-69T480-803q66 0 124.5 25T709-709q44 44 69 102.5T803-480q0 66-25 124.5T709-256q-44 44-102.5 69T480-160Zm-80-160h160v-80H400v80Zm0-160h160v-240H400v240Z"/>
    </svg>
    <span>Update Grades</span>
  </Link>
</li>

      </ul>
      </nav> 
    </div>
      );
    }
    }


    
   
