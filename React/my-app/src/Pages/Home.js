import React, { useEffect, useState } from 'react';
import Stopwatch from '../Components/Stopwatch';
import axios from 'axios';

function Home_test() {
  const [userName, setUserName] = useState('');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (userId) {
      axios.post("http://localhost:8000/api/users/Home", {
        _id: parseInt(userId)
      })
        .then(res => {
          console.log("Response from backend:", res.data);
          setUserName(res.data.name);  // ✅ This is the fix
        })
        .catch(err => {
          console.error("Error fetching user name:", err);
        });
    }
  }, [userId]);

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      {userName ? (
        <h2>Hello, {userName} 👋</h2>
      ) : (
        <h2>Loading user name...</h2>
      )}
      <div>
        <Stopwatch />
      </div>
      <div>
        <button onClick={() => {
          localStorage.removeItem('user_id');
          window.location.href = "/";
        }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home_test;
