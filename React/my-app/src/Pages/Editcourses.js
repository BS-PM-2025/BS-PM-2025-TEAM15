import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Editcourses() {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lecturer: '',
    department: '',
    points: 0
  });
  const [professors, setProfessors] = useState([]);
  const [activeTab, setActiveTab] = useState("courses");

  const currentUserId = parseInt(localStorage.getItem("user_id"));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchCourses();
    checkAdminStatus();
    fetchProfessors();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8000/courses/all/");
      const normalized = res.data.map(c => ({
        name: c.name,
        lecturer: c.lecturer,
        department: c.department || "",
        points: c.points || 0,
        _id: c.course_id || c._id
      }));
      setCourses(normalized);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchProfessors = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/professors/");
      setProfessors(res.data);
    } catch (err) {
      console.error("Error fetching professors:", err);
    }
  };

  const checkAdminStatus = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/isadmin/", {
        userId: currentUserId,
      });
      setIsAdmin(res.data.is_admin);
    } catch (err) {
      console.error("Error checking admin status:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await axios.put(`http://localhost:8000/api/courses/${editingCourse._id}/`, formData);
      } else {
        await axios.post("http://localhost:8000/api/courses/", formData);
      }
      setFormData({ name: '', lecturer: '', department: '', points: 0 });
      setEditingCourse(null);
      fetchCourses();
      setActiveTab("courses");
    } catch (err) {
      console.error("Error saving course:", err);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      lecturer: course.lecturer,
      department: course.department,
      points: course.points || 0
    });
    setActiveTab("add");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/courses/${id}/`);
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  const getLecturerName = (id) => {
    const match = professors.find(p => p.user_id === id);
    return match ? match.name : id;
  };

  return (
    <div style={{ padding: "30px", background: "#f5f8ff", minHeight: "100vh" }}>
      <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#134075", marginBottom: "20px" }}>📘 Course Management</h2>

      <div style={{ background: "white", borderRadius: "15px", padding: "25px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("courses")}
            style={{
              backgroundColor: activeTab === "courses" ? "#134075" : "#e0e7ff",
              color: activeTab === "courses" ? "white" : "#134075",
              border: "none",
              borderRadius: "20px",
              padding: "10px 20px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab("add")}
            style={{
              backgroundColor: activeTab === "add" ? "#134075" : "#e0e7ff",
              color: activeTab === "add" ? "white" : "#134075",
              border: "none",
              borderRadius: "20px",
              padding: "10px 20px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {editingCourse ? "Edit Course" : "Add Course"}
          </button>
        </div>

        {activeTab === "courses" && (
          <div style={{
            maxHeight: "450px",
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            padding: "10px"
          }}>
            {courses.map(course => (
              <div key={course._id} style={{
                backgroundColor: "#f9f9f9",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
              }}>
                <h4 style={{ margin: "0 0 10px", color: "#134075" }}>{course.name}</h4>
                <p style={{ margin: "4px 0", color: "#555" }}>Lecturer: {getLecturerName(course.lecturer)}</p>
                <p style={{ margin: "4px 0", color: "#555" }}>Department: {course.department}</p>
                <p style={{ margin: "4px 0", color: "#555" }}>Points: {course.points}</p>
                {isAdmin && (
                  <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEdit(course)} style={{
                      backgroundColor: "#ffc107",
                      color: "#333",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}>Edit</button>
                    <button onClick={() => handleDelete(course._id)} style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "add" && isAdmin && (
          <form onSubmit={handleSubmit} style={{ marginTop: "30px", background: "#f0f4ff", borderRadius: "12px", padding: "20px", maxWidth: "500px" }}>
            <input
              type="text"
              placeholder="Course Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
           <select
  value={formData.lecturer}
  onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
  required
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px"
  }}
>
  <option value="">Select Lecturer</option>
  {professors.map((prof) => (
    <option key={prof.user_id} value={prof.user_id}>
      {prof.user_id} - {prof.name}
    </option>
  ))}
</select>


            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
            <input
              type="number"
              placeholder="Points"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
              required
              style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
            <button type="submit" style={{
              backgroundColor: "#134075",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer"
            }}>
              {editingCourse ? "Update Course" : "Add Course"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Editcourses;
