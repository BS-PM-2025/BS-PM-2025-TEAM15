import React, { useState } from "react";
import RequestModal from "../Components/RequestModal";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   Box, Typography,TextField,Button,Select,MenuItem,
   FormControl,
   InputLabel
} from "@mui/material";
import axios from "axios";
import "../Components_css/StudentStatusEditor.css"




function StudentLookup() {
  const [studentId, setStudentId] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedAsk, setSelectedAsk] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [currentUserName, setCurrentUserName] = useState("Admin");
  const [Statuschange,setStatusChagne] = useState("")
  

  const currentUserId = 2;
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
    fetch(`http://localhost:8000/studentlookup/${studentId}/`)
      .then(res => {
        if (!res.ok) throw new Error("Student not found");
        return res.json();
      })
      .then(data => setStudentData(data))
      .catch(err => {
        console.error(err);
        alert("Student not found or invalid ID");
      });

    fetch("http://localhost:8000/admins/")
      .then(res => res.json())
      .then(data => {
        setAdmins(data);
        const current = data.find(admin => admin.user_id === currentUserId);
        if (!current) {
          alert("Admin not found");
          setCurrentUserName("Unknown Admin");
        } else {
          setCurrentUserName(current.name);
        }
      })
      .catch(err => {
        console.error(err);
        alert("Failed to fetch admin list");
      });
  };

  const refreshStudent = () => fetchStudentDetails();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Lookup</h2>

      <input
        type="number"
        value={studentId}
        onChange={(e) => setStudentId(Number(e.target.value))}
        placeholder="Enter Student ID"
        style={{ marginRight: "10px" }}
      />
      <button onClick={fetchStudentDetails}>Search</button>

      {studentData && (
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
                    <Typography color="black" variant="h6"><strong>User Id:</strong>  {studentData.info.name}</Typography>
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
                {studentData.courses.map(course => (
                  <li key={course.course_id}>
                    {course.name} (Points: {course.points}) - Grade: {course.grade ?? "Not graded"}
                  </li>
                ))}
              </ul>
              <p><strong>Average:</strong> {studentData.average}</p>
            </div>
          )}

          {activeTab === "asks" && (
            <div>
              <h3>Requests</h3>
              <ul>
                {studentData.asks.map(ask => (
                  <li
                    key={ask._id}
                    onClick={() => setSelectedAsk(ask)}
                    style={{ cursor: "pointer", marginBottom: "10px" }}
                  >
                     {new Date(ask.date_sent).toLocaleDateString()} - <strong>{ask.title}</strong><br />
                    Status: {ask.status}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <RequestModal
            ask={selectedAsk}
            onClose={() => setSelectedAsk(null)}
            currentUserId={currentUserId}
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
