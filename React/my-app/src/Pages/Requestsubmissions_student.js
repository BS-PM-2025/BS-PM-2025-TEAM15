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
    if (!request_type) { //to verfiy that that type is filled
      alert("Please select a valid request type.");
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
    { value: "", label: "Choose type", isDisabled: true }, //hidden choice
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

  console.log("Selected type:", request_type);
  return (
    <div

    >
      <div
        
  className="form-container"
  style={{
    backgroundColor: "#f4f5f6",
    height: "100%",
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "10px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // if needed
  }}
>  
        <form onSubmit={handleSubmit}>
          <h2 style={{
             marginBottom: "15px", color: "#134075",
             fontFamily: "Placebo FM",
             fontSize: "61px",
             fontStyle: "normal",
             fontWeight: "700",
             lineHeight: "73.2px"
             }}>Submit a Request</h2>
           <hr style={{ marginBottom: "20px", color: "#36404c" }}/>

        {/*הסבר על הטופס */}
        <h3 style={{
          fontFamily: "Roboto",
          fontSize: "21px",
          fontStyle: "normal",
          fontWeight: "400",
          lineHeight: "25.2px",
          color: "#5F5F60",
          marginBottom: "10px"
        }}>please submit request in an orderly and complete manner to allow for quick and fair processing.</h3>

          {/* סוג הבקשה */}
          <label style={{ fontWeight: "bold", color: "#2b8678" }}>Request Type:</label>
          <div style={{ marginTop: "10px", marginBottom: "20px" }}>
            <Select
              options={options}
              defaultValue={options[0]}
              onChange={(selected) => setRequest_type(selected.value)}
              styles={{
                control: (base) => ({ //the base of the dropdown

                  ...base,
                  border: "none",
                  backgroundColor: "rgba(74, 144, 226, 0.10)",
                  
                  fontSize: "14px",
                  fontFamily: "Roboto",
                 
                }),
                menu: (base) => ({ //the manu itself
                  ...base,
                  zIndex: 9999,

                  fontFamily: "Roboto",
                  fontSize: "15px",
                  
                }),
                option: (base, state) => ({
                  ...base,
                  color: 'black', 
                  backgroundColor: state.isFocused ? 'rgba(74, 144, 226, 0.10)' : 'white',
                }),
              }}
            />
          </div>
          <div>
              {(request_type?.toLowerCase() === 'course-related' || request_type?.toLowerCase() === 'grade-related' )  && (
            <div style={{ marginTop: '1px' }}>
              <h4 style={{fontWeight: "bold", color: "#2b8678"}}>Select Related Course:</h4>
              <Select
                options={courseOptions}
                onChange={(selected) => setRelatedCourse(selected)}
                styles={{
                  control: (base) => ({
                      ...base,
                      border: "none",
                      backgroundColor: "rgba(74, 144, 226, 0.10)",
                      height: "45px", 
                      fontSize: "14px",
                      fontFamily: "Roboto",
                  }),
                  option: (base, state) => ({
                      ...base,
                      color: 'black',
                      backgroundColor: state.isFocused ? 'rgba(74, 144, 226, 0.10)' : 'white',
                  }),
                  singleValue: (base) => ({ ...base, color: 'black' }),
                }}
              />
            </div>
          )}
        </div>
  

          {/* נושא */}
          <label style={{ fontWeight: "bold", color: "#2b8678" }}>Title: </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter the subject of your request"
            style={{
              backgroundColor: "rgba(74, 144, 226, 0.10)",
              padding: "10px",
              border: "none",
              marginTop: "10px",
              marginBottom: "20px",
              width: "600px",
            }}
          />

          {/* פירוט */}
          <br />
          <label style={{ fontWeight: "bold", color: "#2b8678" }}>Description:</label>
          <br />
          <textarea
            placeholder="Your detailed request"
            rows="6"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            style={{
              backgroundColor: "rgba(74, 144, 226, 0.10)",
              padding: "10px",
              border: "none",
              marginTop: "10px",
              width: "900px",
            }}
          />

          <br />
          <br />
          {/* העלאת קובץ */}
          <label style={{ fontWeight: "bold", color: "#2b8678" }}></label> 
          <div style={{ marginTop: "10px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
            <label
              htmlFor="fileUpload"
              style={{
                display: "flex",
                alignItems: "center", 
                padding: "10px 15px",
                backgroundColor: "transparent",
                width: "200px",
                color: "#4b596b",
                borderRadius: "5px",
                borderColor: "#4b596b",
                border: "2px solid #4b596b",
                cursor: "pointer",
                fontWeight: "bold",
                fontFamily: "Roboto",
                justifyContent: "space-between"
              }}
            >
              Upload File 
            {/*הוספת סימן */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10.7071 0.292893C10.3166 -0.0976311 9.68342 -0.0976311 9.29289 0.292893L4.29289 5.29289C3.90237 5.68342 3.90237 6.31658 4.29289 6.70711C4.68342 7.09763 5.31658 7.09763 5.70711 6.70711L9 3.41421V13.0714C9 13.6237 9.44771 14.0714 10 14.0714C10.5523 14.0714 11 13.6237 11 13.0714V3.41421L14.2929 6.70711C14.6834 7.09763 15.3166 7.09763 15.7071 6.70711C16.0976 6.31658 16.0976 5.68342 15.7071 5.29289L10.7071 0.292893Z" fill="#2D3648"/>
            <path d="M2 13C2 12.4477 1.55228 12 1 12C0.447715 12 0 12.4477 0 13V17C0 17.7957 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H17C17.7957 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7957 20 17V13C20 12.4477 19.5523 12 19 12C18.4477 12 18 12.4477 18 13V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V13Z" fill="#2D3648"/>
            </svg>
            </label>
            <label style={{fontFamily: "Roboto", color: "#4b596b"}}>**Only supports .pdf files.</label>

            <input
              id="fileUpload"
              type="file"
              accept=".pdf"
              onChange={(e) => setAttachment(e.target.files[0])}
              style={{ display: "none" }}
            />
            {attachment && (
              <div style={{ color: "#3A5781", fontSize: "18px", marginTop: "12px" }}>
                Selected File:  {attachment.name}
              </div>
            )}
          </div>

          {/* כפתור שליחה */}
          <input
            type="submit"
            value="Submit Request"
            style={{
              padding: "12px 10px",
              backgroundColor: "#4b596b",
              color: "white",
              border: "none",
              marginLeft: "300px",
              marginTop:"10px",
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