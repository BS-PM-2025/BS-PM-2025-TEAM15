import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home_test() {
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    newMessages: 0,
  });

  const userId = localStorage.getItem('user_id');
  console.log("USER ID FROM LOCAL STORAGE:", userId);


  useEffect(() => {
    if (userId) {
      axios.post("http://localhost:8000/api/users/Home", {
        _id: parseInt(userId)
      })
        .then(res => {
          setUserName(res.data.name);
        })
        .catch(err => console.error("Error fetching user name:", err));

      // בקשת נתונים סטטיסטיים
      axios.get(`http://localhost:8000/api/stats/${userId}`)

        .then(res => {
          setStats(res.data);
        })
        .catch(err => console.error("Error fetching stats:", err));
    }
  }, [userId]);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.welcome}>Welcome to the Home Page!</h1>
      {userName ? (
        <h2 style={styles.hello}>Hello {userName} 👋 (ID: {userId})</h2>
      ) : (
        <h2 style={styles.loading}>Loading user name...</h2>
      )}

      <p style={styles.dateText}>📅 {today}</p>

      <div style={styles.statsContainer}>
        <div style={styles.card}>📨 Total Requests<br /><strong>{stats.totalRequests}</strong></div>
        <div style={styles.card}>✅ Approved Requests<br /><strong>{stats.doneRequests}</strong></div>
        <div style={styles.card}>🕓 Requests in Progress<br /><strong>{stats.IN_progress}</strong></div>
        <div style={styles.card}>⏳ Pending Requests<br /><strong>{stats.pendingRequests}</strong></div>

      </div>

      <button
        style={styles.logoutButton}
        onClick={() => {
          localStorage.removeItem('user_id');
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    padding: '40px',
    background: 'linear-gradient(to right, #6dd5ed, #c66adf)',
    color: '#ffffff',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  welcome: {
    fontSize: '2.7rem',
    fontWeight: 800,
    marginBottom: '10px'
  },
  hello: {
    fontSize: '1.8rem',
    fontWeight: 600,
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  loading: {
    fontSize: '1.5rem',
    fontStyle: 'italic',
    opacity: 0.8
  },
  dateText: {
    fontSize: '1.2rem',
    marginTop: '10px',
    marginBottom: '20px'
  },
  statsContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '20px 30px',
    borderRadius: '15px',
    fontSize: '1.1rem',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    minWidth: '180px'
  },
  logoutButton: {
    marginTop: '20px',
    backgroundColor: '#ff4d4f',
    color: 'white',
    padding: '12px 30px',
    border: 'none',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  }
};

export default Home_test;
