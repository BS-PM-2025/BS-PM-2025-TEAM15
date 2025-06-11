import React, { useState, useEffect } from "react";

import RequestModal from "../Components/RequestModal";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   Box, Typography,TextField,Button,Select,MenuItem,
   FormControl,
   InputLabel
} from "@mui/material";
import axios from "axios";
import "../Components_css/StudentStatusEditor.css"
import Course_tree from "../Components/Course_tree";




function StudentLookup() {
  const [studentId, setStudentId] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedAsk, setSelectedAsk] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [currentUserName, setCurrentUserName] = useState("Admin");
  const [Statuschange,setStatusChagne] = useState("")
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importance, setImportance] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  //ID של המשתמש שמחובר הרגע לאתר מחזיר INT 
  const admin_id = parseInt(localStorage.getItem("user_id")); // force int

  useEffect(() => {
    fetch("http://localhost:8000/admins/")
      .then(res => res.json())
      .then(data => {
        setAdmins(data);
        const current = data.find(admin => parseInt(admin.user_id) === admin_id);
        setCurrentUserName(current?.name || "Unknown Admin");
      })
      .catch(err => {
        console.error(err);
        alert("Failed to fetch admin list");
      });
  }, [admin_id]); // <- only runs once
  

  const options = [
    "Medical","Army","Active"

  ];
  const handleApprove = (e) => {
    update_status(e);
    alert("Approved!");
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setStatusChagne(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const update_status = (event) =>{
    event.preventDefault();
    const formData = new FormData();

    formData.append("user_id",studentId);
    formData.append("Statuschange", Statuschange);

    axios.post('http://localhost:8000/api/update_status/',formData,{
      headers: {
        "Content-Type": "multipart/form-data",
      }, 
    })
    .then((response) => {
      console.log("Request sent successfully:", response.data);
      fetchStudentDetails();
  })
  .catch((error) => {
    console.error("Error sending request:", error.response?.data || error.message);  })
  };

  const fetchAvailableCourses = () => {
  if (!studentId) return;

  fetch(`http://localhost:8000/api/available_courses/${studentId}/`)
    .then(res => res.json())
    .then(data => {
      setAvailableCourses(data);
    })
    .catch(err => {
      console.error("Failed to fetch courses:", err);
      alert("Failed to load available courses.");
    });
};


  const fetchStudentDetails = () => {
    const parsedId = parseInt(studentId);
    if (isNaN(parsedId)) {
      alert("Please enter a valid numeric student ID.");
      return;
    }

    setLoading(true);
    fetch(`http://localhost:8000/studentlookup/${parsedId}/`)
      .then(res => {
        if (!res.ok) throw new Error("Student not found");
        return res.json();
      })
      .then(data => setStudentData(data))
      .catch(err => {
        console.error(err);
        alert("Student not found or invalid ID");
      })
      .finally(() => setLoading(false));

  };

  const fetchAskDetails = async (idr) => {
  const res = await fetch(`http://localhost:8000/asks/${idr}/`);
  const data = await res.json();
  setSelectedAsk(data); // 👈 re-set modal data with fresh info
};


  const enrollInCourse = (courseId) => {
  const payload = {
    user_id: parseInt(studentId),
    course_id: courseId,
  };
  axios.post("http://localhost:8000/api/enroll_course/", payload)
    .then(() => {
      alert("Student enrolled successfully!");
      fetchStudentDetails();
      fetchAvailableCourses();
    })
    .catch(err => {
      console.error("Enrollment failed:", err);
      alert("Enrollment failed.");
    });
};

const clearAll = () => {
  setStudentId("");
  setStudentData(null);
  setActiveTab("info");
  setImportance("");
  setStatus("");
  setCategory("");
  setSortBy("");
  setSortOrder("asc");
  setFromDate("");
  setToDate("");
  setSelectedAsk(null);
};


  const refreshStudent = () => fetchStudentDetails();
  console.log("well",studentId)

  const applyAskFilters = () => {
  if (!studentData) return [];

  let filtered = [...studentData.asks];

  // Normalize importance
  if (importance) {
    filtered = filtered.filter(a => (a.importance || "").toLowerCase() === importance.toLowerCase());
  }

  // Normalize status
  if (status) {
    filtered = filtered.filter(a => {
      const stat = (a.status || "").toLowerCase();
      if (status === "in progress") {
        return a.status?.startsWith("בטיפול");
      }
      return stat === status.toLowerCase();
    });
  }

  if (category) {
    filtered = filtered.filter(a => (a.category || "").toLowerCase() === category.toLowerCase());
  }

  if (fromDate) {
    filtered = filtered.filter(a => new Date(a.date_sent) >= new Date(fromDate));
  }

  if (toDate) {
    filtered = filtered.filter(a => new Date(a.date_sent) <= new Date(toDate));
  }

  if (sortBy === "importance") {
    const order = { high: 0, medium: 1, low: 2 };
    filtered.sort((a, b) => (order[a.importance?.toLowerCase()] ?? 3) - (order[b.importance?.toLowerCase()] ?? 3));
  } else if (sortBy === "date") {
    filtered.sort((a, b) => new Date(a.date_sent) - new Date(b.date_sent));
  }

  if (sortOrder === "desc") filtered.reverse();

  return filtered;
};


  return (
   <div style={{
  backgroundColor: "#f5f8ff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  marginBottom: "30px",
  display: "flex",
  flexDirection: "column",
  gap: "20px"
}}>
  <h2 style={{
    margin: 0,
    fontSize: "24px",
    color: "#134075",
    fontWeight: 700
  }}>
    🔎 Search Student by ID
  </h2>

  <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center"
  }}>
    <input
      type="number"
      value={studentId}
      onChange={(e) => setStudentId(e.target.value)}
      placeholder="Enter student ID"
      style={{
        flex: "1",
        minWidth: "150px",
        padding: "10px 15px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "16px"
      }}
    />
    <button onClick={fetchStudentDetails} style={{
      backgroundColor: "#134075",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer"
    }}>
      Search
    </button>
    <button onClick={clearAll} style={{
      backgroundColor: "#ddd",
      color: "#333",
      border: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer"
    }}>
      Clear
    </button>
  </div>


      {loading && <p>Loading student data...</p>}

      {studentData && !loading && (

        
       <div style={{ marginTop: "30px" }}>
  {/* Tab Navigation */}
  <div style={{
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    borderBottom: "2px solid #ccc",
    paddingBottom: "10px"
  }}>
    {["info", "courses", "asks", "enroll"].map((tab) => (
      <button
        key={tab}
        onClick={() => {
          setActiveTab(tab);
          if (tab === "enroll") fetchAvailableCourses();
        }}
        style={{
          backgroundColor: activeTab === tab ? "#134075" : "transparent",
          color: activeTab === tab ? "white" : "#134075",
          border: "1px solid #134075",
          padding: "10px 20px",
          borderRadius: "20px",
          cursor: "pointer",
          fontWeight: 600,
          transition: "all 0.3s",
        
        }}
      >
        {{
          info: "Student Info",
          courses: "Courses & Average",
          asks: "Requests",
          enroll: "Enroll in Course"
        }[tab]}
      </button>
    ))}
  </div>

  {/* Student Info Tab */}
  {activeTab === "info" && (
    <div className="profile_student" style={{
      backgroundColor: "#f5f7fb",
      padding: "30px",
      borderRadius: "15px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
    }}>
      <Typography variant="h5" color="#134075" gutterBottom>
        👤 Student Details
      </Typography>
      <Typography variant="body1" style={{ color: '#134075' }}><strong>Name:</strong> {studentData.info.name}</Typography>
      <Typography variant="body1" style={{ color: '#134075' }}><strong>User ID:</strong> {studentData.info.user_id}</Typography>
      <Typography variant="body1" style={{ color: '#134075' }}><strong>Email:</strong> {studentData.info.email}</Typography>
      <Typography variant="body1" style={{ color: '#134075' }}><strong>Department:</strong> {studentData.info.department}</Typography>
      <Typography variant="body1" style={{ color: '#134075' }}><strong>Status:</strong> {studentData.info.status}</Typography>
      <Typography variant="body1" style={{ color: '#134075' }}><strong>Sum points:</strong> {studentData.info.sum_points}</Typography>
      <Typography variant="body1" style={{ color: '#134075' }}><strong>Average:</strong> {studentData.info.average}</Typography>

      {/* Status Changer */}
      <div style={{ marginTop: "20px" }}>
        <FormControl fullWidth>
          <InputLabel>Status Changer</InputLabel>
          <Select
            value={Statuschange}
            label="Status Changer"
            onChange={handleChange}
          >
            {options.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <Box sx={{ display: "flex", gap: 2, marginTop: 3 }}>
        <Button variant="contained" color="success" onClick={handleApprove}>✅ Approve</Button>
      </Box>
    </div>
  )}

  {/* Courses Tab */}
  {activeTab === "courses" && (
    <div style={{
      backgroundColor: "#f5f7fb",
      padding: "30px",
      borderRadius: "15px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      maxHeight: "400px",         // NEW
      overflowY: "auto" 
    }}>
      <Typography variant="h5" color="#134075" gutterBottom>
        📚 Enrolled Courses
      </Typography>
      <Course_tree userId={studentId} />
    </div>
  )}



{activeTab === "asks" && (
  <div>
    <h3 style={{ color: "#134075", marginBottom: "10px" }}>📝 Filter Requests</h3>

    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      marginBottom: "30px",
      background: "#f1f4ff",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <label>
        <span style={{ color: '#134075' }}>Importance:</span>
        <select value={importance} onChange={e => setImportance(e.target.value)}>
          <option value="">..</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>

      <label>
        <span style={{ color: '#134075' }}>Status:</span>
        <select value={status} onChange={e => setStatus(e.target.value)}>
  <option value="">..</option>
  <option value="pending">Pending</option>
  <option value="in progress">In Progress</option>
  <option value="closed">Closed</option>
</select>

      </label>

      <label>
        <span style={{ color: '#134075' }}>Category:</span>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">..</option>
          <option value="financial">Financial</option>
          <option value="medical">Medical</option>
          <option value="course management">Course Management</option>
          <option value="grade">Grade</option>
          <option value="other">Other</option>
          <option value="army service">Army Service</option>
        </select>
      </label>

      <label>
        <span style={{ color: '#134075' }}>Sort by:</span>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">..</option>
          <option value="importance">Importance</option>
          <option value="date">Date Sent</option>
        </select>
      </label>

      <div>
        <span style={{ color: '#134075' }}>Order:</span>
        <button onClick={() => setSortOrder("asc")} style={{ marginLeft: "5px" }}>⬆️</button>
        <button onClick={() => setSortOrder("desc")} style={{ marginLeft: "5px" }}>⬇️</button>
      </div>

      <label>
        <span style={{ color: '#134075' }}>From:</span>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
      </label>

      <label>
        <span style={{ color: '#134075' }}>To:</span>
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
      </label>
    </div>

    <div style={{
  maxHeight: "350px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  paddingRight: "5px"
}}>
  {applyAskFilters().map((ask) => (
    <div
      key={ask._id}
      onClick={() => setSelectedAsk(ask)}
      style={{
        cursor: "pointer",
        borderRadius: "10px",
        padding: "20px 30px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        borderLeft: ask.importance === "high" ? "5px solid #d9534f" :
                    ask.importance === "medium" ? "5px solid #f0ad4e" :
                    "5px solid #5bc0de"
      }}
    >
      <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ fontSize: "14px", color: "#666" }}>
          📅 {new Date(ask.date_sent).toLocaleDateString()}
        </div>
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "#134075" }}>
          📝 {ask.title}
        </div>
        <div style={{ fontSize: "14px", color: "#333" }}>
          👤 Student ID: {ask.id_sending}
        </div>
      </div>

      <div style={{
        flex: 0,
        backgroundColor:
          ask.status?.toLowerCase().includes("pending") ? "#777" :
          ask.status?.toLowerCase().includes("closed") ? "#28a745" :
          ask.status?.toLowerCase().includes("assigned") || ask.status?.includes("בטיפול") ? "#f0ad4e" :
          "#aaa",
        color: "#fff",
        borderRadius: "12px",
        padding: "6px 16px",
        fontSize: "13px",
        fontWeight: "bold",
        whiteSpace: "nowrap"
      }}>
        {ask.status}
      </div>
    </div>
  ))}
</div>

       
  </div>
)}


          {selectedAsk && (
  <RequestModal
    ask={selectedAsk}
    onClose={() => setSelectedAsk(null)}
    admin_id={admin_id}
    currentUserName={currentUserName}
    admins={admins}
    refreshAsks={() => fetchAskDetails(selectedAsk.idr)} // 👈 wrap it here
  />
)}

        </div>
      )}
     {activeTab === "enroll" && (
  <div style={{
    backgroundColor: "#f5f7fb",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxHeight: "400px",        // ✅ enable vertical scroll
    overflowY: "auto"
  }}>
    <h3 style={{ color: "#134075" }}>📥 Available Courses for Enrollment</h3>
    {availableCourses.length === 0 ? (
      <p>No available courses or all already enrolled.</p>
    ) : (
      <ul>
        {availableCourses.map(course => (
          <li key={course.course_id} style={{ marginBottom: "10px" }}>
            {course.name} ({course.points} points)
            <Button
              variant="outlined"
              color="primary"
              onClick={() => enrollInCourse(course.course_id)}
              style={{ marginLeft: "10px" }}
            >
              Enroll
            </Button>
          </li>
        ))}
      </ul>
    )}
  </div>
)}

    </div>
  );
}

export default StudentLookup;
