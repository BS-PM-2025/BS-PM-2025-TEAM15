import React, { useEffect, useState } from "react";
import axios from "axios";

const PROFILE_URL = "http://localhost:8000/api/student/profile";

function Student_Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [StudentName, setStudentName] = useState("");
  const [Email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(PROFILE_URL, {
          params: { user_id: parseInt(userId) }
        });
        setProfile(response.data);
        setStudentName(response.data.name);
        setEmail(response.data.email);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile data.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    } else {
      setError("User not logged in.");
      setLoading(false);
    }
  }, [userId]);

  const handleSave = async () => {
    try {
      const response = await axios.put(PROFILE_URL, {
        user_id: parseInt(userId),
        name: StudentName,
        email: Email
      });
      setMessage("Profile updated successfully!");
      setProfile(prev => ({ ...prev, name: StudentName, email: Email}));
    } catch (err) {
      setMessage("Failed to update profile.");
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading profile...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;
 
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Student Profile</h2>
      <div style={cardStyle}>
        <EditableField label="Name" value={StudentName} onChange={e => setStudentName(e.target.value)} />
        <EditableField label="Email" value={Email} onChange={e => setEmail(e.target.value)} />
        <ProfileItem label="Department" value={profile.department} />
        <ProfileItem label="Status" value={profile.status} />
        <ProfileItem label="Total Points" value={profile.sum_points} />
        
        <button onClick={handleSave} style={buttonStyle}>Save Changes</button>
        {message && <div style={{ marginTop: "1rem", color: "green" }}>{message}</div>}
      </div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <strong>{label}: </strong> {value}
    </div>
  );
}

function EditableField({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <strong>{label}:</strong>
      <input type="text" value={value} onChange={onChange} style={{ marginLeft: "0.5rem", padding: "0.3rem" }} />
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#f4f4f4",
  padding: "1.5rem",
  borderRadius: "10px",
  boxShadow: "0 0 8px rgba(0,0,0,0.1)",
  maxWidth: "500px"
};

const buttonStyle = {
  padding: "0.5rem 1rem",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer"
};

export default Student_Profile;