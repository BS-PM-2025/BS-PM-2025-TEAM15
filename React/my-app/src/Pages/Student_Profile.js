import React, { useEffect, useState } from "react";
import axios from "axios";

const PROFILE_URL = "http://localhost:8000/api/student/profile";

function Student_Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [StudentName, getStudentName] = useState(null);
  const [Email, getEmail] = useState(null);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(PROFILE_URL, {
          params: { user_id: parseInt(userId) }
        });
        setProfile(response.data);
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

  if (loading) return <div style={{ padding: "2rem" }}>Loading profile...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;
 
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Student Profile</h2>
      <div style={cardStyle}>
        <ProfileItem label="Name" value={profile.name} />
        <ProfileItem label="Email" value={profile.email} />
        <ProfileItem label="Department" value={profile.department} />
        <ProfileItem label="Status" value={profile.status} />
        <ProfileItem label="Total Points" value={profile.sum_points} />
        <ProfileItem label="Average" value={profile.average} />
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

const cardStyle = {
  backgroundColor: "#f4f4f4",
  padding: "1.5rem",
  borderRadius: "10px",
  boxShadow: "0 0 8px rgba(0,0,0,0.1)",
  maxWidth: "400px"
};

export default Student_Profile;