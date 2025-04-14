import React, { useState, useEffect } from "react";
import Select from "react-select";
import Progress from "../Components/Progress";
import axios from "axios";

// To what endpoint to send
 const BASE_URL = 'http://localhost:8000/api/studentrequests/';

function Requestsubmissions_student() {
  const [quote, setQuote] = useState("");
  const [subject, setSubject] = useState("");
  const [request_type, setRequest_type] = useState("Medical");
  const [attachment, setAttachment] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!subject.trim() || !quote.trim()) {
      alert("Please fill in both the subject and details before submitting.");
      return;
    }
    alert(`Type: ${request_type}\nSubject: ${subject}\nFile: ${attachment?.name || "None"}`);
    console.log("Subject:", subject);
    console.log("Quote:", quote);
    console.log("File:", attachment);

    setProgress(0);
    setShowProgress(true);
    const formData = new FormData();

    formData.append("id_sending", 1);
    formData.append("id_receiving", 2);
    formData.append("importance", "high");
    formData.append("title", subject);
    formData.append("text", quote);
    formData.append("department", 2);
  
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


  const options = [
    { value: "Medical", label: "Medical Request" },
    { value: "financial", label: "Financial Request" },
    {value : "grade-related" ,label :"Grade-related Request"},
    {value : "Course-related", label :"Course-related Request"}
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        width: "50vw",
      }}
    >
      <div
        className="form-container"
        style={{
          backgroundColor: "#0c1c33",
          padding: "30px",
          borderRadius: "10px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          boxSizing: "border-box",
          overflow: "hidden",
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
              }}
            />
          </div>

          {/* נושא */}
          <label style={{ fontWeight: "bold", color: "white" }}>Request Subject:</label>
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
              width: "100%",
            }}
          />

          {/* פירוט */}
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
              width: "100%",
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
              <div style={{ color: "white", fontSize: "14px", marginTop: "10px" }}>
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