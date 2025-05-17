import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL_STUDENT_COURSES = "http://localhost:8000/api/student/dashboard";

function Student_Dashboard() {
  const [courses, setCourses] = useState([]);
  const [earnedCredits, setEarnedCredits] = useState(0);
  const [remainingCredits, setRemainingCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("user_id");
  const[response,setreponse] = useState(null);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(BASE_URL_STUDENT_COURSES, {
          params: { user_id: parseInt(userId) }
        });
        console.log(response.data.amount_completed)
        setreponse(response);
        setCourses(response.data.courses);
        console.log(response.data.completed_courses);
        setEarnedCredits(response.data.total_earned_credits);
        setRemainingCredits(response.data.credits_remaining);
        
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch course information.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchCourses();
    } else {
      setError("User not logged in.");
      setLoading(false);
    }
  }, [userId]);
  
  if (loading) return <div style={{ padding: "2rem" }}>Loading your courses...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;
  
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Student Dashboard</h2>

      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
        <StatsBox label="Earned Credits" value={earnedCredits} />
        <StatsBox label="Credits Remaining" value={remainingCredits} />
      </div>
      
      <h3>Completed Courses</h3>
      { response.data.completed_amount === 0 ? (
        <p>You have not completed any courses yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th style={thStyle}>Course Name</th>
              <th style={thStyle}>Lecturer ID</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Credits</th>
              <th style={thStyle}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{course.name}</td>
                <td style={tdStyle}>{course.lecturer}</td>
                <td style={tdStyle}>{course.department}</td>
                <td style={tdStyle}>{course.points}</td>
                <td style={tdStyle}>{course.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function StatsBox({ label, value }) {
  return (
    <div style={{
      padding: "1rem",
      border: "1px solid #ccc",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9",
      minWidth: "150px",
      textAlign: "center"
    }}>
      <h4 style={{ margin: "0 0 0.5rem" }}>{label}</h4>
      <p style={{ fontSize: "1.5rem", margin: 0 }}>{value}</p>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#f2f2f2",
  textAlign: "left"
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px"
};

export default Student_Dashboard;
