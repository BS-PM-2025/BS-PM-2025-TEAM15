// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../Components_css/StudentStatusEditor.css"
// import Course_tree from "../Components/Course_tree";
// import {
//   Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//    Box, Typography,TextField,Button,Select,MenuItem,
//    FormControl,
//    InputLabel
// } from "@mui/material";

// const BASE_URL_STUDENT_COURSES = "http://localhost:8000/api/student/dashboard";
// const FAILED_INPROGRESS_COURSE  = "http://localhost:8000/api/graph/";

// function Student_Dashboard() {
//   const [courses, setCourses] = useState([]);
//   const [earnedCredits, setEarnedCredits] = useState(0);
//   const [remainingCredits, setRemainingCredits] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const userId = localStorage.getItem("user_id");
//   const [failed_courses,setfailed_course] = useState([]); {/* Failed_felix */}
//   const [inprogress_course,setinprogress_course] = useState([]); {/* inprogress_felix */}
//   const [activeTab, setActiveTab] = useState("info");
  

//   const[response,setreponse] = useState(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await axios.get(BASE_URL_STUDENT_COURSES, {
//           params: { user_id: parseInt(userId) }
//         });
//         console.log(response.data.amount_completed)
//         setreponse(response);
//         setCourses(response.data.courses);
//         console.log("we21",response.data.courses);
//         console.log(response.data.completed_courses);
//         setEarnedCredits(response.data.total_earned_credits);
//         setRemainingCredits(response.data.credits_remaining);
        
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch course information.");
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchCourses();
//     } else {
//       setError("User not logged in.");
//       setLoading(false);
//     }
//   }, [userId]);

//   {/* Getting Failed and inprogress courses */}
//   useEffect(() => {
//     const fetchFailedAndInProgress = async () => {
//       try {
//         const userResponse = await axios.post('http://localhost:8000/api/graph/', null, {
//           params: { user_id: userId },
//         });
//         const userCourses = userResponse.data.courses;
//         userCourses.forEach((course, idx) => {
//           console.log(`📘 Course ${idx + 1}:`);
//           Object.entries(course).forEach(([key, value]) => {
//             console.log(`   ${key}:`, value);
//           });
//         });
//         let failed = [];
//         let inprogress = [];
  
//         userCourses.forEach(c => {
          
//           if (c.finish === true && c.grade < 60) {
//             failed.push(c.name);
           
//           }
//           if (c.finish === false || c.finish == null) {

//             inprogress.push(c.name);
//             console.log("grade",c.name);
//             console.log("Department",c.finish);
//           }
//         });

      
//         setfailed_course(failed);
//         setinprogress_course(inprogress);
        
        
//       } catch (err) {
//         console.error("Failed to fetch user graph info", err);
//       }
//     };
  
//     if (userId) {
//       fetchFailedAndInProgress();
//     }
//   }, [userId]);

  
//   if (loading) return <div style={{ padding: "2rem" }}>Loading your courses...</div>;
//   if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;
  


//   return (
//     <div>
//     <div style={{ padding: "2rem", fontFamily: "Arial" }}>
//       <h2>Student Dashboard</h2>
//       <div style={{
//     display: "flex",
//     gap: "15px",
//     marginBottom: "10px",
//     borderBottom: "2px solid #ccc",
//     paddingBottom: "10px"
//     }}>
//     {["info", "Graph"].map((tab) => (
//       <button
//         key={tab}
//         onClick={() => {
//           setActiveTab(tab);
          
//         }}
//         style={{
//           backgroundColor: activeTab === tab ? "#134075" : "transparent",
//           color: activeTab === tab ? "white" : "#134075",
//           border: "1px solid #134075",
//           padding: "10px 20px",
//           borderRadius: "20px",
//           cursor: "pointer",
//           fontWeight: 600,
//           transition: "all 0.3s",
        
//         }}
//       >
//         {{
//           info: "table",
//           Graph: "Graph",
//           asks: "Requests",
//           enroll: "Enroll in Course"
//         }[tab]}
//       </button>
//     ))}
//     </div>
  
//    { activeTab === "info" && (
//    <div>
//     <div className="profile_student" style={{
//       backgroundColor: "#f5f7fb",
//       padding: "30px",
//       borderRadius: "15px",
//       boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
//     }}></div>
//       <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
//         <StatsBox label="Earned Credits" value={earnedCredits} />
//         <StatsBox label="Credits Remaining" value={remainingCredits} />
//       </div>
      
//       <h3>Completed Courses</h3>
//       { response.data.completed_amount === 0 ? (
//         <p>You have not completed any courses yet.</p>
//       ) : (
       
//         <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
//           <thead>
//             <tr>
//               <th style={thStyle}>Course Name</th>
//               <th style={thStyle}>Lecturer ID</th>
//               <th style={thStyle}>Department</th>
//               <th style={thStyle}>Credits</th>
//               <th style={thStyle}>Grade</th>
//             </tr>
//           </thead>
//           <tbody>
//             {courses.map((course, idx) => (
//               course.grade > 56 && course.finished === true ?  ( //checking if He passed the course and completed it.
//               <tr key={idx}>
//                 <td style={tdStyle}>{course.name}</td>
//                 <td style={tdStyle}>{course.lecturer}</td>
//                 <td style={tdStyle}>{course.department}</td>
//                 <td style={tdStyle}>{course.points}</td>
//                 <td style={tdStyle}>{course.grade}</td>
//               </tr> )
//               : ""
//             ))}
//           </tbody>
//         </table>
//       )}
//       </div>
//       ) }

//       {/* Felix's Code. */}
//       <br/>
//       <h3>Failed Courses</h3>
//       <div>
//         {failed_courses.length === 0 ? (
//           <p>You have no failed courses. Keep it up! 🎉</p>
//         ) : (
//           <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
//             <thead>
//               <tr>
//                 <th style={thStyle}>Course Name</th>
//                 <th style={thStyle}>Lecturer ID</th>
//                 <th style={thStyle}>Department</th>
//                 <th style={thStyle}>Credits</th>
//                 <th style={thStyle}>Grade</th>
//               </tr>
//             </thead>
//             <tbody>
//               {courses
//                 .filter(course => failed_courses.includes(course.name))
//                 .map((course, idx) => (
//                   <tr key={idx}>
//                     <td style={tdStyle}>{course.name}</td>
//                     <td style={tdStyle}>{course.lecturer}</td>
//                     <td style={tdStyle}>{course.department}</td>
//                     <td style={tdStyle}>{course.points}</td>
//                     <td style={tdStyle}>{course.grade}</td>
//                   </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//        </div>

//         {/* Felix's Code. */}
//         <br/>
//         <h3>inprogress Courses</h3>
//       <div>
//         {inprogress_course.length === 0 ? (
//           <p>You have no rolled courses. Keep it up! 🎉</p>
//         ) : (
//           <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
//             <thead>
//               <tr>
//                 <th style={thStyle}>Course Name</th>
//                 <th style={thStyle}>Lecturer ID</th>
//                 <th style={thStyle}>Department</th>
//                 <th style={thStyle}>Credits</th>
//                 <th style={thStyle}>Grade</th>
//               </tr>
//             </thead>
//             <tbody>
//             {courses
//                 .filter(course => inprogress_course.includes(course.name))
//                 .map((course, idx) => (
//                   <tr key={idx}>
//                     <td style={tdStyle}>{course.name}</td>
//                     <td style={tdStyle}>{course.lecturer}</td>
//                     <td style={tdStyle}>{course.department}</td>
//                     <td style={tdStyle}>{course.points}</td>
//                     <td style={tdStyle}>{'-'}</td>
//                   </tr>
//               ))}
//             </tbody>
//           </table> )}
//         </div>

//      { activeTab === "courses" && (
//       <div>
//     <div style={{
//       backgroundColor: "#f5f7fb",
//       padding: "30px",
//       borderRadius: "15px",
//       boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//       maxHeight: "400px",         // NEW
//       overflowY: "auto" 
//     }}>
//       <Typography variant="h5" color="#134075" gutterBottom>
//         📚 Enrolled Courses
//       </Typography>
//       <Course_tree userId={userId} />
//     </div>
//     </div>
//      )}
//   </div>
//   </div>  )}

// function StatsBox({ label, value }) {
//   return (
//     <div style={{
//       padding: "1rem",
//       border: "1px solid #ccc",
//       borderRadius: "10px",
//       backgroundColor: "#f9f9f9",
//       minWidth: "150px",
//       textAlign: "center"
//     }}>
//       <h4 style={{ margin: "0 0 0.5rem" }}>{label}</h4>
//       <p style={{ fontSize: "1.5rem", margin: 0 }}>{value}</p>
//     </div>
//   );
// }

// const thStyle = {
//   border: "1px solid #ccc",
//   padding: "8px",
//   backgroundColor: "#f2f2f2",
//   textAlign: "left"
// };

// const tdStyle = {
//   border: "1px solid #ccc",
//   padding: "8px"
// };

// export default Student_Dashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Course_tree from "../Components/Course_tree";
import { Typography } from "@mui/material";
import "../Components_css/StudentStatusEditor.css";

const BASE_URL_STUDENT_COURSES = "http://localhost:8000/api/student/dashboard";
const FAILED_INPROGRESS_COURSE = "http://localhost:8000/api/graph/";

function Student_Dashboard() {
  const [courses, setCourses] = useState([]);
  const [earnedCredits, setEarnedCredits] = useState(0);
  const [remainingCredits, setRemainingCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failed_courses, setFailedCourses] = useState([]);
  const [inprogress_course, setInProgressCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const [response, setResponse] = useState(null);
 const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(BASE_URL_STUDENT_COURSES, {
          params: { user_id: parseInt(userId) },
        });
        setResponse(res);
        setCourses(res.data.courses);
        setEarnedCredits(res.data.total_earned_credits);
        setRemainingCredits(res.data.credits_remaining);
      } catch {
        setError("Failed to fetch course information.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchCourses();
    else {
      setError("User not logged in.");
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
        const fetchFailedAndInProgress = async () => {
          try {
            const userResponse = await axios.post('http://localhost:8000/api/graph/', null, {
              params: { user_id: userId },
            });
            const userCourses = userResponse.data.courses;
            userCourses.forEach((course, idx) => {
              console.log(`📘 Course ${idx + 1}:`);
              Object.entries(course).forEach(([key, value]) => {
                console.log(`   ${key}:`, value);
              });
            });
            let failed = [];
            let inprogress = [];
      
            userCourses.forEach(c => {
              
              if (c.finish === true && c.grade < 60) {
                failed.push(c.name);
               
              }
              if (c.finish === false || c.finish == null) {
    
                inprogress.push(c.name);
                console.log("grade",c.name);
                console.log("Department",c.finish);
              }
            });
    
          
            setFailedCourses(failed);
            setInProgressCourses(inprogress);
            
            
          } catch (err) {
            console.error("Failed to fetch user graph info", err);
          }
        };
      
        if (userId) {
          fetchFailedAndInProgress();
        }
      }, [userId]);
    
  if (loading) return <div style={{ padding: "2rem" }}>Loading your courses...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;

  const renderTable = (title, list, showGrade = true) => (
    <>
      <h3>{title}</h3>
      {list.length === 0 ? (
        <p>
          {title === "Failed Courses"
            ? "You have no failed courses. Keep it up! 🎉"
            : title === "In-Progress Courses"
            ? "You have no in-progress courses. Keep it up! 🎉"
            : "You have not completed any courses yet."}
        </p>
      ) : (
        <table style={tableStyle}>
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
            {list.map((course, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{course.name}</td>
                <td style={tdStyle}>{course.lecturer}</td>
                <td style={tdStyle}>{course.department}</td>
                <td style={tdStyle}>{course.points}</td>
                <td style={tdStyle}>{showGrade ? course.grade : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );

  const completedCourses = courses.filter(c => c.grade > 56 && c.finished === true);
  const failedCourses = courses.filter(c => failed_courses.includes(c.name));
  const inProgressCourses = courses.filter(c => inprogress_course.includes(c.name));

  return (
   
    <div style={{ padding: "1rem", fontFamily: "Arial" }}>
    <h2>Student Dashboard</h2>
    <br/>
    <div style={tabContainerStyle}>
      {["info", "courses"].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === tab ? "#134075" : "transparent",
            color: activeTab === tab ? "white" : "#134075",
          }}
        >
          {{
            info: "Table",
            courses: "Course Tree",
          }[tab]}
        </button>
      ))}
    </div>
  
    {/* FIXED HEIGHT TAB CONTENT CONTAINER */}
    <div style={tabContentContainer}>
      {activeTab === "info" && (
        <div style={profile_student}>
          <div style={cardStyle}>
            <div style={statsRowStyle}>
              <StatsBox label="Earned Credits" value={earnedCredits} />
              <StatsBox label="Credits Remaining" value={remainingCredits} />
            </div>
            {renderTable("Completed Courses", completedCourses)}
            <br />
            {renderTable("Failed Courses", failedCourses)}
            <br />
            {renderTable("In-Progress Courses", inProgressCourses, false)}
          </div>
        </div>
      )}
  
  <div style={{ display: activeTab === "courses" ? "block" : "none" }}>
    <div style={graph_student}>
      <div style={cardScrollable}>
        <Typography variant="h5" color="#134075" gutterBottom>
          📚 Enrolled Courses
        </Typography>
        <Course_tree userId={userId} />
      </div>
    </div>
  </div>
  </div>
  </div>
  );
}

function StatsBox({ label, value }) {
  return (
    <div style={statsBoxStyle}>
      <h4 style={{ margin: "0 0 0.5rem" }}>{label}</h4>
      <p style={{ fontSize: "1.5rem", margin: 0 }}>{value}</p>
    </div>
  );
}

// 🔹 Styles
const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#f2f2f2",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "1rem",
};

const tabContainerStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "10px",
  borderBottom: "2px solid #ccc",
  paddingBottom: "10px",
};

const tabButtonStyle = {
  border: "1px solid #134075",
  padding: "10px 20px",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: 600,
  transition: "all 0.3s",
};

const cardStyle = {
  backgroundColor: "#f5f7fb",
  padding: "10px",
  borderRadius: "15px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  height: "650px",
  padding: "2rem",
  
};

const cardScrollable = {
  ...cardStyle,
  Height: "800px",
  width: "1150px",
  overflowY: "auto",
};

const statsRowStyle = {
  display: "flex",
  gap: "2rem",
  marginBottom: "2rem",
};
const profile_student = {
  width: "800px",
  marginLeft: "1px",
  padding: "0.25rem",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#f2f1f1",
  marginTop: "25px",
  height: "500px",
  display: "flex",
  flexDirection: "column",
  gap: "2rem"
};
const tabContentContainer = {
  height: "720px", // total dashboard height you want
  overflow: "hidden", // ensures nothing grows beyond
  paddingTop: "20px",
};
const graph_student = {
  width: "1200px",
  overflowY: "auto",
  marginLeft: "1px",
  padding: "1rem",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#f2f1f1",
  height: "680px",
  display: "flex",
  flexDirection: "column",
  gap: "2rem"
};
const statsBoxStyle = {
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "10px",
  backgroundColor: "#f9f9f9",
  minWidth: "150px",
  textAlign: "center",
};

export default Student_Dashboard;