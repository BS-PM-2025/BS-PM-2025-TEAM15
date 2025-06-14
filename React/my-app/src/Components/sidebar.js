import React, { useEffect, useState, useRef } from "react";
import styles from "../App.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaBell } from 'react-icons/fa'; // 

export default function Sidebar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isProf, setIsProf] = useState(false);
  const BASE_URL_ADMIN = 'http://localhost:8000/api/isadmin/';
  const BASE_URL_PROF = 'http://localhost:8000/api/isprof/';
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnseen, setHasUnseen] = useState(false);

  const toggleButtonRef = useRef(null);
  const sidebarRef = useRef(null);
  const userId = localStorage.getItem('user_id');

  function closeAllSubMenus(e) {
    if (!e || !e.currentTarget) return;
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

  function toggleSubMenu(e) {
    if (!e || !e.currentTarget) return;
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

  useEffect(() => {
    if (userId) {
      axios.post(BASE_URL_ADMIN, { userId }, {
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          setIsAdmin(response.data.is_admin);
        })
        .catch((error) => {
          console.error("Admin check failed:", error);
          setIsAdmin(false);
        });

      axios.post(BASE_URL_PROF, { userId }, {
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          setIsProf(response.data.is_prof);
        })
        .catch((error) => {
          console.error("Professor check failed:", error);
          setIsProf(false);
        });

      axios.get(`http://localhost:8000/notifications/?user_id=${userId}`)
  .then((res) => {
    setNotifications(res.data);
    const unseen = res.data.some(n => n.seen === false);
    setHasUnseen(unseen);
  })
  .catch((err) => console.error("Failed to load notifications:", err));

    }
  }, [userId]);

  const handleBellClick = async () => {
  setShowNotifications(!showNotifications);
  if (!showNotifications) {
await axios.post(`http://localhost:8000/notifications/mark_seen/`, {
  user_id: userId
});
    setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
    setHasUnseen(false);
  }
  
};

  const logoutButton = (
    <li>
      <button
        onClick={() => {
          localStorage.removeItem('user_id');
          window.location.href = "/";
        }}
        style={{
          backgroundColor: ' #ff4d4f',
          color: 'white',
          padding: '5px 10px',
          border: 'none',
          borderRadius: '20px',
          fontSize: '1rem',
          marginTop: '20px',
          cursor: 'pointer',
          width: '97%',
          marginLeft: '30%',
          marginBottom: '20px'
        }}
      >
        Logout
      </button>
    </li>
  );

const bellNotification = (
  <li style={{ position: 'relative' }}>
  <button
    onClick={handleBellClick}
    style={{
      background: 'none',
      border: 'none',
      padding: '5px 10px',
      marginTop: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#e8eaed',
      fontSize: '1rem'
    }}
  >
    <span style={{ fontSize: '1.2rem' }}>🔔</span>
    <span>Notifications</span>
    {hasUnseen && (
      <span
        style={{
          position: 'absolute',
          top: '2px',
          right: '-2px',
          height: '10px',
          width: '10px',
          backgroundColor: 'dodgerblue',
          borderRadius: '50%'
        }}
      />
    )}
  </button>

  {showNotifications && (
    <div
      style={{
        position: 'absolute',
        top: '40px',
        right: '0px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: '300px',
        zIndex: 1000,
        maxHeight: '300px',
        overflowY: 'auto',
        padding: '10px',
        color: 'black'
      }}
    >
      {notifications.length === 0 ? (
        <div style={{ padding: '10px' }}>No notifications.</div>
      ) : (
        notifications.map((n, idx) => (
          <div
            key={idx}
            style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
          >
            <strong>{new Date(n.time).toLocaleString()}</strong>
            <div>{n.text}</div>
          </div>
        ))
      )}
    </div>
  )}
</li>

);

  if (!isAdmin) {
    return (
      <nav className="topbar" ref={sidebarRef}>
        <ul>
          <li>
            <Link to="/Home">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M240-200h120v-200q0-17 11.5-28.5T400-440h160q17 0 28.5 11.5T600-400v200h120v-360L480-740 240-560v360Z" />
              </svg>
              <span>Home</span>
            </Link>
          </li>

          <li>
            <button onClick={toggleSubMenu} className="dropdown-btn" ref={toggleButtonRef}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="m221-313 142-142q12-12 28-11.5t28 12.5q11 12 11 28t-11 28L250-228q-12 12-28 12t-28-12l-86-86q-11-11-11-28t11-28q11-11 28-11t28 11l57 57Z" />
              </svg>
              <span>Profile</span>
            </button>
            <ul className="sub-menu">
              {/* Profile submenu (optional) */}
            </ul>
          </li>

          <li>
            <Link to="/Student_Dashboard">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M240-200h120v-200q0-17 11.5-28.5T400-440h160q17 0 28.5 11.5T600-400v200h120v-360L480-740 240-560v360Z" />
              </svg>
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <button onClick={() => setIsProfileOpen(prev => !prev)} className="dropdown-btn" ref={toggleButtonRef}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h207q16 0 30.5 6t25.5 17l57 57h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Z" />
              </svg>
              <span>Requests</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M480-361q-8 0-15-2.5t-13-8.5L268-556q-11-11-11-28t11-28q11-11 28-11t28 11l156 156 156-156q11-11 28-11t28 11q11 11 11 28t-11 28L508-372q-6 6-13 8.5t-15 2.5Z" />
              </svg>
            </button>
            <ul className={`sub-menu ${isProfileOpen ? "show" : ""}`}>
              <li><Link to="/Requestsubmissions_student">Send request</Link></li>
              <li><Link to="/Student_status_request">Student status request</Link></li>
            </ul>
          </li>

          <li>
            <Link to="/exams">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M200-80q-33 0-56.5-23.5T120-160v-640q0-33 23.5-56.5T200-880h400q17 0 28.5 11.5T640-840q0 17-11.5 28.5T600-800H200v640h560v-280q0-17 11.5-28.5T800-480q17 0 28.5 11.5T840-440v280q0 33-23.5 56.5T760-80H200Z" />
              </svg>
              <span>Exams</span>
            </Link>
          </li>
          {bellNotification}
          {logoutButton}
        </ul>
      </nav>
    );
  } else {
    return (
      <div>
        <nav className="topbar" ref={sidebarRef}>
          <ul>
            <li>
              <Link to="/Home">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-200h120v-200q0-17 11.5-28.5T400-440h160q17 0 28.5 11.5T600-400v200h120v-360L480-740 240-560v360Z" /></svg>
                <span>Home</span>
              </Link>
            </li>

            <li>
              <Link to="/asks">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h207q16 0 30.5 6t25.5 17l57 57h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Z" /></svg>
                <span>View Requests</span>
              </Link>
            </li>

            <li>
              <Link to="/studentlookup">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#e8eaed"><path d="M480-480Zm0 400q-66 0-124.5-25T256-256q-44-44-69-102.5T160-480q0-66 25-124.5T256-709q44-44 102.5-69T480-803q66 0 124.5 25T709-709q44 44 69 102.5T803-480q0 66-25 124.5T709-256q-44 44-102.5 69T480-80Z" /></svg>
                <span>Student Lookup</span>
              </Link>
            </li>

            {isProf && (
              <li>
                <Link to="/professor-grade-update">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                    <path d="M480-160q-66 0-124.5-25T256-256q-44-44-69-102.5T160-480q0-66 25-124.5T256-709q44-44 102.5-69T480-803q66 0 124.5 25T709-709q44 44 69 102.5T803-480q0 66-25 124.5T709-256q-44 44-102.5 69T480-160Zm-80-160h160v-80H400v80Zm0-160h160v-240H400v240Z" />
                  </svg>
                  <span>Update Grades</span>
                </Link>
              </li>
            )}

            {isAdmin && !isProf && (
              <li>
                <Link to="/Editcourses">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#e8eaed">
                    <path d="M720-120v-80H600v-80h120v-80l120 120-120 120Zm-640-40v-640 640Zm120 0q-33 0-56.5-23.5T120-240v-640q0-33 23.5-56.5T200-960h560q33 0 56.5 23.5T840-880v240h-80v-240H200v640h280v80H200Zm440-240Z" />
                  </svg>
                  <span>Edit Courses</span>
                </Link>
              </li>
            )}
            {bellNotification}
            {logoutButton}
          </ul>
        </nav>
      </div>
    );
  }
}
