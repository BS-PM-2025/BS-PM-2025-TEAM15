import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL_STUDENT_COURSES = "http://localhost:8000/api/student/courses"; // Adjust this to your actual Django route

function Student_Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("user_id"); //fetch user_id

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(BASE_URL_STUDENT_COURSES, { params: { user_id: parseInt(userId) }});
        setCourses(response.data);
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

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading your courses...</div>;
  }

  if (error) {
    return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Student Dashboard</h2>
      <h3>Your Enrolled Courses</h3>
      {courses.length === 0 ? (
        <p>You are not enrolled in any courses.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th style={thStyle}>Course Name</th>
              <th style={thStyle}>Lecturer ID</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Points</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td style={tdStyle}>{course.name}</td>
                <td style={tdStyle}>{course.lecturer}</td>
                <td style={tdStyle}>{course.department}</td>
                <td style={tdStyle}>{course.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
