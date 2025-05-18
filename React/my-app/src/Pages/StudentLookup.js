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
  }

  
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

  const refreshStudent = () => fetchStudentDetails();
  console.log("well",studentId)
  const applyAskFilters = () => {
    if (!studentData) return [];

    let filtered = [...studentData.asks];
    if (importance) filtered = filtered.filter(a => a.importance === importance);
    if (status) filtered = filtered.filter(a => a.status === status);
    if (category) filtered = filtered.filter(a => a.category === category);
    if (fromDate) filtered = filtered.filter(a => new Date(a.date_sent) >= new Date(fromDate));
    if (toDate) filtered = filtered.filter(a => new Date(a.date_sent) <= new Date(toDate));

    if (sortBy === "importance") {
      const order = { high: 0, medium: 1, low: 2 };
      filtered.sort((a, b) => (order[a.importance] ?? 3) - (order[b.importance] ?? 3));
    } else if (sortBy === "date") {
      filtered.sort((a, b) => new Date(a.date_sent) - new Date(b.date_sent));
    }

    if (sortOrder === "desc") filtered.reverse();
    return filtered;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Lookup</h2>

      <input
        type="number"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        placeholder="Enter Student ID"
        style={{ marginRight: "10px" }}
      />
      <button onClick={fetchStudentDetails}>Search</button>

      {loading && <p>Loading student data...</p>}

      {studentData && !loading && (
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <button onClick={() => setActiveTab("info")}>Student Info</button>
            <button onClick={() => setActiveTab("courses")} style={{ marginLeft: "10px" }}>Courses & Average</button>
            <button onClick={() => setActiveTab("asks")} style={{ marginLeft: "10px" }}>Requests</button>
          </div>

          {activeTab === "info" && (
            <div className="profile_student">
                  <Box >
                    {/* <Typography  color="black" variant="h3">👤 Student Details</Typography> */}
                    <Typography color="black" variant="h6"><strong>User Id:</strong>  {studentData.info.user_id}</Typography>
                    <Typography color = "black" variant="h6"><strong>Email: </strong>{studentData.info.email}</Typography>
                    <Typography color="black" variant="h6" ><strong>Department:</strong> {studentData.info.department}</Typography>
                    <Typography color="black" variant="h6"><strong>Status:</strong> {studentData.info.status}</Typography>
                    <Typography color="black" variant="h6"><strong>Sum points:</strong> {studentData.info.sum_points}</Typography>
                    <Typography color="black" variant="h6"><strong>Average:</strong> {studentData.info.average}</Typography>
                    <br/>
                    <div className="statusoptionchanger">
                      <FormControl>
                        <InputLabel id="demo-simple-select-helper-label" >Status Changer</InputLabel>
                        <Select
                         options={options}
                          value={Statuschange}
                          label="Status Changer"
                          onChange={handleChange}
                          className="mySelect"
                         
                         
                        >
                          {options.map((options) => (
                        <MenuItem
                          key={options}
                          value={options}
                        >
                          {options}
                        </MenuItem> 
                          ))}
                        </Select>
                        
                      </FormControl>
                      </div>
                        
                      <br/>
                    <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                   
                      
                    <Button variant="contained" color="success" onClick={handleApprove}>✅ Approve</Button>
                      {/* <Button variant="outlined" onClick={() => setSelectedStudent(null)}>🔙 Back</Button> */}
                    </Box>
                  </Box>
                  </div>
            // <div>
            //   <h3>Student Information</h3>
            //   <p><strong>Name:</strong> {studentData.info.name}</p>
            //   <p><strong>Email:</strong> {studentData.info.email}</p>
            //   <p><strong>Department:</strong> {studentData.info.department}</p>
            //   <p><strong>Status:</strong> {studentData.info.status}</p>
            //   <p><strong>Points:</strong> {studentData.info.sum_points}</p>
            //   <p><strong>Average:</strong> {studentData.info.average}</p>
            // </div>
          )}

          {activeTab === "courses" && (
            <div>
              <h3>Enrolled Courses</h3>
              <ul>
                <Course_tree userId = {studentId}/>
                {/* {studentData.courses.map(course => (
                  <li key={course.course_id}>
                    {course.name} (Points: {course.points}) - Grade: {course.grade ?? "Not graded"}
                  </li>
                ))}
              </ul>
              <p><strong>Average:</strong> {studentData.average}</p>
            </div> */}
            </ul>
            </div>
          )}

          {activeTab === "asks" && (
            <div>
              <h3>Requests</h3>

              <div style={{ marginBottom: "15px", display: "flex", flexWrap: "wrap", gap: "50px", width: "100%", maxWidth: "1100px" }}>
                <label>
                  Importance:
                  <select value={importance} onChange={e => setImportance(e.target.value)}>
                    <option value="">..</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </label>

                <label>
                  Status:
                  <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="">..</option>
                    <option value="pending">Pending</option>
                    <option value="assigned to self">Assigned to Self</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>

                <label>
                  Category:
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
                  Sort by:
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="">..</option>
                    <option value="importance">Importance</option>
                    <option value="date">Date Sent</option>
                  </select>
                </label>

                <div>
                  Order:
                  <button onClick={() => setSortOrder("asc")} style={{ marginLeft: "5px" }}>⬆️</button>
                  <button onClick={() => setSortOrder("desc")} style={{ marginLeft: "5px" }}>⬇️</button>
                </div>

                <label>
                  From:
                  <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                </label>

                <label>
                  To:
                  <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                </label>
              </div>

              <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
                <ul>
                  {applyAskFilters().map(ask => (
                    <li
                      key={ask._id}
                      onClick={() => setSelectedAsk(ask)}
                      style={{ cursor: "pointer", marginBottom: "10px" }}
                    >
                      {new Date(ask.date_sent).toLocaleDateString()} - <strong>{ask.title}</strong><br />
                      Status: {ask.status} | Category: {ask.category}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <RequestModal
            ask={selectedAsk}
            onClose={() => setSelectedAsk(null)}
            admin_id={admin_id}
            currentUserName={currentUserName}
            admins={admins}
            refreshAsks={refreshStudent}
          />
        </div>
      )}
    </div>
  );
}

export default StudentLookup;
