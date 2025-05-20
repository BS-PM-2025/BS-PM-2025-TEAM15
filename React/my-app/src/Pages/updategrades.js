import React, { useEffect, useState } from "react";
import axios from "axios";

function ProfessorGrades() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const user_id = parseInt(localStorage.getItem("user_id"));

  useEffect(() => {
    if (!user_id || isNaN(user_id)) return;

    axios.get(`http://127.0.0.1:8000/api/professor_courses/${user_id}/`)
      .then(res => setCourses(res.data))
      .catch(err => console.error("Failed to fetch courses:", err));
  }, [user_id]);

  const handleCourseClick = (courseId) => {
    setSelectedCourse(courseId);

    axios.get(`http://127.0.0.1:8000/api/students_in_course/${courseId}/`)
      .then(res => setStudents(res.data))
      .catch(err => console.error("Failed to fetch students:", err));
  };

  const closeStudentTable = () => {
    setSelectedCourse(null);
    setStudents([]);
  };

  const saveGrade = (student) => {
    axios.post(`http://127.0.0.1:8000/api/update_grade/`, {
      user_id: student.user_id,
      course_id: selectedCourse,
      grade: student.grade,
    })
    .then(() => alert("✅ Grade saved!"))
    .catch(err => {
      console.error("Failed to save grade:", err);
      alert("❌ Error saving grade.");
    });
  };

  const handleGradeChange = (index, value) => {
    const updated = [...students];
    updated[index].grade = value;
    setStudents(updated);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📚 Your Courses</h2>
      <p>Logged in as Professor (ID: {user_id})</p>

      <div style={{ marginBottom: "20px" }}>
        {courses.length === 0 ? (
          <p>No courses found or still loading...</p>
        ) : (
          courses.map(course => (
            <button
              key={course._id}
              onClick={() => handleCourseClick(course._id)}
              style={{
                marginRight: "10px",
                marginBottom: "10px",
                padding: "8px 16px",
                backgroundColor: "#3f51b5",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              {course.name}
            </button>
          ))
        )}
      </div>

      {selectedCourse && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>👥 Students in Course</h3>
            <button
              onClick={closeStudentTable}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 12px",
                cursor: "pointer"
              }}
            >
              Close Table
            </button>
          </div>

          {students.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "10px", border: "1px solid #ccc", borderRadius: "4px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ position: "sticky", top: 0, backgroundColor: "#f0f0f0", zIndex: 1 }}>
                  <tr>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Name</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>User ID</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Grade</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.user_id}>
                      <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.name}</td>
                      <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.user_id}</td>
                      <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                        <input
                          type="number"
                          value={s.grade}
                          onChange={e => handleGradeChange(i, e.target.value)}
                          style={{ width: "60px", padding: "4px" }}
                        />
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                        <button
                          onClick={() => saveGrade(s)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#4caf50",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfessorGrades;
