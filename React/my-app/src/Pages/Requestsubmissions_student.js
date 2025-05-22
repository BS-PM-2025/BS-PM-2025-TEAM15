import React, { useState, useEffect } from "react";
import Select from "react-select";
import Progress from "../Components/Progress";
import axios from "axios";
console.log("✅ Requestsubmissions_student loaded");

// To what endpoint to send
 const BASE_URL = 'http://localhost:8000/api/studentrequests/';
 const user_id  = localStorage.getItem('user_id');
function Requestsubmissions_student() {
  const [quote, setQuote] = useState("");
  const [subject, setSubject] = useState("");
  const [request_type, setRequest_type] = useState("Medical");
  const [attachment, setAttachment] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [relatedCourse, setRelatedCourse] = useState(null);
  const [courseOptions, setCourseOptions] = useState([]);

  
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!subject.trim() || !quote.trim()) {
      alert("Please fill in both the subject and details before submitting.");
      return;
    }
    alert(`Type: ${request_type}\nSubject: ${subject}\nFile: ${attachment?.name || "None"}`);
    console.log("Subject:", subject); //category.
    console.log("Quote:", quote);
    console.log("File:", attachment);
    

    setProgress(0);
    setShowProgress(true);
    const formData = new FormData();
    formData.append("id_sending", user_id);
    //add logic of to which to send.
    if (request_type === "Course-related" || request_type === "grade-related" ) {
      if (!relatedCourse) {
        alert("Please select a course first.");
        return;
      }
      formData.append("id_receiving", relatedCourse.lecturer);
      formData.append("course_id", relatedCourse.value); // optional: pass the selected course
    } else if (request_type === "Medical") {
      formData.append("id_receiving", 2); //getting sent to the medical admin responsible 
    } else if (request_type === "financial") {
      formData.append("id_receiving", 4); //getting sent to the financial admin responsible 
    }
    //logic importance. depend on the type of the request.
    formData.append("importance", "high");
    formData.append("title", subject);
    formData.append("text", quote);
    formData.append("category",request_type);

    //add logic of department.

    formData.append("department", "2");
  
    if (attachment) {
      formData.append("documents", attachment);  // Important!
    }
  
    setProgress(0);
    setShowProgress(true);
  
    axios.post(BASE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("Request sent successfully:", response.data);
      //add -> מחיקת מידע ברגע שאושר בקשה (מחיקת שדות )
      setProgress(100);

      setTimeout(() => {
        alert("Request has been sent successfully!");
        setShowProgress(false);
        setProgress(0);
      }, 2000);  
    
    })
    .catch((error) => {
      console.error("Error sending request:", error.response?.data || error.message);
      setShowProgress(false);
      setProgress(0);
    });
  };
  useEffect(() => {
    let interval;
    if (showProgress) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            return prev;  // Stop at 90% until success
          }
          return prev + 5;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [showProgress]);

  useEffect(() => {
    console.log("Changed request_type to:", request_type);
  }, [request_type]);

  const options = [
    { value: "Medical", label: "Medical Request" },
    { value: "financial", label: "Financial Request" },
    {value : "grade-related" ,label :"Grade-related Request"},
    {value : "Course-related", label :"Course-related Request"}
  ];

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
  
    axios.get(`http://localhost:8000/api/studentrequests/`, {
      params: { _id: user_id }
    })
    .then((response) => {
      const courses = response.data.courses || [];
  
      // Transform each course to { value, label } format
      const formatted = courses.map(course => ({
        value: course._id, 
        label: `${course.name} (${course.points} pts)`,
        lecturer: course.lecturer 
      }));
  
      setCourseOptions(formatted);
    })
    .catch((error) => {
      console.error("Error fetching courses:", error);
    });
  }, []);
  
  // const courseOptions = [
  //   { value: 'cs101', label: 'CS101 - Introduction to Computer Science' },
  //   { value: 'cs102', label: 'CS102 - Data Structures and Algorithms' },
  //   { value: 'math201', label: 'MATH201 - Linear Algebra' },
  //   { value: 'math202', label: 'MATH202 - Calculus II' },
  //   { value: 'phys101', label: 'PHYS101 - General Physics I' },
  //   { value: 'eng301', label: 'ENG301 - Academic Writing' },
  //   { value: 'cs303', label: 'CS303 - Operating Systems' },
  //   { value: 'cs304', label: 'CS304 - Databases' },
  //   { value: 'cs305', label: 'CS305 - Computer Networks' },
  //   { value: 'cs306', label: 'CS306 - Software Engineering' },
  // ];

  console.log("Selected type:", request_type);
  return (
    <div

    >
      <div
        
  className="form-container"
  style={{
    backgroundColor: "#0c1c33",
    height: "100%",
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "10px",
    boxSizing: "border-box",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // if needed
  }}
>  
        <form onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: "20px", color: "#6c63ff" }}>Submit a Request</h2>

          {/* סוג הבקשה */}
          <label style={{ fontWeight: "bold", color: "white" }}>Request Type:</label>
          <div style={{ marginTop: "10px", marginBottom: "20px" }}>
            <Select
              options={options}
              defaultValue={options[0]}
              onChange={(selected) => setRequest_type(selected.value)}
              styles={{
                control: (base) => ({
                  
                  ...base,
                  borderRadius: "5px",
                  borderColor: "#ccc",
                  
                  fontSize: "14px",
                 
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
                option: (base, state) => ({
                  ...base,
                  color: 'black', 
                  backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
                }),
              }}
            />
          </div>
          <div>
              {(request_type?.toLowerCase() === 'course-related' || request_type?.toLowerCase() === 'grade-related' )  && (
            <div style={{ marginTop: '1px' }}>
              <h4>Select Related Course:</h4>
              <Select
                options={courseOptions}
                onChange={(selected) => setRelatedCourse(selected)}
                styles={{
                  option: (base) => ({ ...base, color: 'black' }),
                  singleValue: (base) => ({ ...base, color: 'black' }),
                }}
              />
            </div>
          )}
        </div>
  

          {/* נושא */}
          <label style={{ fontWeight: "bold", color: "white" }}>Request Subject: </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter the subject of your request"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginTop: "10px",
              marginBottom: "20px",
              width: "600px",
            }}
          />

          {/* פירוט */}
          <br />
          <label style={{ fontWeight: "bold", color: "white" }}>Details:</label>
          <br />
          <textarea
            placeholder="Your Quote"
            rows="6"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginTop: "10px",
              width: "900px",
            }}
          />

          <br />
          <br />
          {/* העלאת קובץ */}
          <label style={{ fontWeight: "bold", color: "white" }}>Upload File:</label>
          <div style={{ marginTop: "10px", marginBottom: "20px" }}>
            <label
              htmlFor="fileUpload"
              style={{
                display: "inline-block",
                padding: "10px 15px",
                backgroundColor: "#6c63ff",
                width: "300px",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Choose File
            </label>
            <input
              id="fileUpload"
              type="file"
              accept=".pdf"
              onChange={(e) => setAttachment(e.target.files[0])}
              style={{ display: "none" }}
            />
            {attachment && (
              <div style={{ color: "white", fontSize: "18px", marginTop: "12px" }}>
                Selected File: {attachment.name}
              </div>
            )}
          </div>

          {/* כפתור שליחה */}
          <input
            type="submit"
            value="Submit Request"
            style={{
              padding: "12px 25px",
              backgroundColor: "#6c63ff",
              color: "white",
              border: "none",
              marginLeft: "300px",
              marginTop:"25px",
              width: "300px",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          />

          <br />
          <br />
          {showProgress && <Progress progress={progress} />}
        </form>
      </div>
    </div>
  );
}

export default Requestsubmissions_student;