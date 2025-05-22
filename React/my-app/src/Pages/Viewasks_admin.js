import React, { useEffect, useState } from "react";
import RequestModal from "../Components/RequestModal";

function ViewAsks() {
  const admin_id = parseInt(localStorage.getItem("user_id"));
  const [asks, setAsks] = useState([]);
  const [selectedAsk, setSelectedAsk] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [currentUserName, setCurrentUserName] = useState("Admin");

  const [importance, setImportance] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

    applyFilters();
  }, [admin_id]);

  const applyFilters = () => {
    let url = `http://localhost:8000/asks/?admin_id=${admin_id}&`;
    if (importance) url += `importance=${importance}&`;
    if (status) url += `status=${status}&`;
    if (category) url += `category=${category}&`;
    if (sortBy) url += `sort=${sortBy}&order=${sortOrder}&`;
    if (fromDate) url += `from=${fromDate}&`;
    if (toDate) url += `to=${toDate}&`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(ask => ask.status !== "closed");
        setAsks(filtered);
      });
  };

  const clearFilters = () => {
    setImportance("");
    setStatus("");
    setCategory("");
    setSortBy("");
    setSortOrder("asc");
    setFromDate("");
    setToDate("");
    applyFilters();
  };

  const refreshAsks = () => applyFilters();

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: '#134075',marginBottom: "40px" }}>Incoming Requests</h2>

      {/* Filters */}
      <div style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
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
            <option value="assigned to self">Assigned to Self</option>
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
          <button onClick={() => { setSortOrder("asc"); applyFilters(); }} style={{ marginLeft: "5px" }}>⬆️</button>
          <button onClick={() => { setSortOrder("desc"); applyFilters(); }} style={{ marginLeft: "5px" }}>⬇️</button>
        </div>

        <label>
          <span style={{ color: '#134075' }}>From:</span>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        </label>

        <label>
          <span style={{ color: '#134075' }}>To:</span>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        </label>

        <div style={{ display: "flex", gap: "5px" }}>
          <button onClick={applyFilters}>Apply Filters</button>
          <button onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>

      {/* Ask Cards */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        
       flexDirection: 'column',
        gap: "20px",
        maxHeight: "60vh",
        overflowY: "auto",
        padding: "10px"
      }}>
        {asks.map((ask) => (
          <div
            key={ask._id}
            onClick={() => setSelectedAsk(ask)}
            style={{
              cursor: "pointer",
              width: "280px",
              borderRadius: "12px",
              padding: "15px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderLeft: ask.importance === "high" ? "5px solid #d9534f" :
                          ask.importance === "medium" ? "5px solid #f0ad4e" :
                          "5px solid #5bc0de"
            }}
          >
            <div style={{ fontSize: "14px", color: "#666" }}>
              📅 {new Date(ask.date_sent).toLocaleDateString()}
            </div>
            <div style={{ fontSize: "16px",color:' #134075', fontWeight: "bold", margin: "5px 0" }}>
              📝 {ask.title}
            </div>
            <div style={{ fontSize: "14px", color: "#333", marginBottom: "8px" }}>
              👤 Student ID: {ask.id_sending}
            </div>
            <span style={{
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#fff",
              backgroundColor:
                ask.status === "pending" ? "rgba(53, 57, 53, 0.51)" :
                ask.status === "Done" ? "rgb(54, 220, 65)" :
                  "  #90900fb0 "        
            }}>
              {ask.status}
            </span>
            
          </div>
        ))}
      </div>

      <RequestModal
        ask={selectedAsk}
        onClose={() => setSelectedAsk(null)}
        admin_id={admin_id}
        currentUserName={currentUserName}
        admins={admins}
        refreshAsks={refreshAsks}
      />
    </div>
  );
}

export default ViewAsks;
