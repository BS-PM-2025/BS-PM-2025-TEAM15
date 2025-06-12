import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Components_css/StudentStatusEditor.css"
import axios from "axios";
import Modal from '@mui/material/Modal';
import SearchIcon from '@mui/icons-material/Search';//icon
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
     Box, Typography,TextField,Button,Select,MenuItem,
     FormControl,
     InputLabel
  } from "@mui/material";

  const options = [
    "Medical","Army","Active"

  ];
  

function StudentStatusEditor({placeholder , data}){
    const [inputValue, setInputValue] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [Statuschange,setStatusChagne] = useState("")

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (inputValue.trim().length > 0) {
                axios.get(`http://localhost:8000/api/search/?query=${inputValue}`)
                    .then(res => setFilteredData(res.data))
                    .catch(err => console.error(err));
            } else {
                setFilteredData([]);
            }
        }, 300); // debounce

        return () => clearTimeout(delayDebounceFn);
    }, [inputValue]);

    useEffect(() => {
      if (!selectedStudent) {
        setInputValue("");       
        setFilteredData([]); 
        setStatusChagne(null) ;  
      }
    }, [selectedStudent]);


  
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setStatusChagne(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleApprove = (e) => {
    update_status(e);
    alert("Approved!");
  };
  const update_status = (event) =>{
      event.preventDefault();
      const formData = new FormData();

      formData.append("user_id",selectedStudent.user_id);
      formData.append("Statuschange", Statuschange);

      axios.post('http://localhost:8000/api/update_status/',formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        }, 
      })
      .then((response) => {
        console.log("Request sent successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error sending request:", error.response?.data || error.message);  })
    }
  
    
    const handleClose = () => setOpenModal(false);
    const renderStudentDetails = () => (
      <div className="profile_student">
      <Box >
        <Typography  color="black" variant="h3"> Student Details</Typography>
        <Typography color="black" variant="h4"> User Id: {selectedStudent.user_id}</Typography>
        <Typography color="black" variant="h6" ><strong>Department:</strong> {selectedStudent.department}</Typography>
        <Typography color="black" variant="h6"><strong>Status:</strong> {selectedStudent.status}</Typography>
        <Typography color="black" variant="h6"><strong>Sum points:</strong> {selectedStudent.sum_points}</Typography>
        <Typography color="black" variant="h6"><strong>Average:</strong> {selectedStudent.average}</Typography>
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
       
          
        <Button variant="contained" color="success" onClick={handleApprove}> Approve</Button>
          <Button variant="outlined" onClick={() => setSelectedStudent(null)}>🔙 Back</Button>
        </Box>
      </Box>
      </div>
    );
  
    const renderSearchAndTable = () => (
      <>
      <div className="Search">
      <div className="searchInputs">
          <TextField
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            variant="outlined"
            size="small"
          />
         <div className="searchIcon"><SearchIcon/></div></div>
        </div>
        <div className="tableWrapper">
        
             <TableContainer component={Paper} sx={{ maxWidth: 800, margin: "auto", marginTop: 4, boxShadow: 3 }}>
                 <Table sx ={{midWidth:650}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>User Id</TableCell>
                <TableCell align="right">Department</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow
                  key={row._id || index}
                  onClick={() => setSelectedStudent(row)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" }
                  }}
                >
                  <TableCell>{row.user_id}</TableCell>
                  <TableCell align="right">{row.department}</TableCell>
                  <TableCell align="right">{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
      </>
    );
  
    return (
      <div className="search">
        {selectedStudent ? renderStudentDetails() : renderSearchAndTable()}
      </div>
    );


    
}

export default StudentStatusEditor;
