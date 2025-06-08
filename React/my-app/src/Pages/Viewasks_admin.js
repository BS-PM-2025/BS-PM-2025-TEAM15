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
    if (importance) url += `importance=${importance.toLowerCase()}&`;
    if (status) url += `status=${status.toLowerCase()}&`;
    if (category) url += `category=${category.toLowerCase()}&`;
    if (sortBy) url += `sort=${sortBy}&order=${sortOrder}&`;
    if (fromDate) url += `from=${fromDate}&`;
    if (toDate) url += `to=${toDate}&`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setAsks(data); // ✅ DO NOT filter out closed here
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
      <h2 style={{ color: '#134075', marginBottom: "40px" }}>Incoming Requests</h2>

      {/* Filters */}
      <div style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "30px" }}>
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
            <option value="in progress">In Progress</option>
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

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <label>
            <span style={{ color: '#134075' }}>From:</span>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </label>
          <label>
            <span style={{ color: '#134075' }}>To:</span>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </label>
          <div style={{ display: "flex", gap: "15px" }}>
            <button onClick={applyFilters}>Apply Filters</button>
            <button onClick={clearFilters}>Clear Filters</button>
          </div>
        </div>
      </div>

      {/* Ask Cards */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "10px",
        alignItems: "center",
        maxHeight: "60vh",
        overflowY: "auto"
      }}>
        {asks.map((ask) => (
          <div
            key={ask._id}
            onClick={() => setSelectedAsk(ask)}
            style={{
              cursor: "pointer",
              width: "90%",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "30px 40px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderLeft: ask.importance === "high" ? "5px solid #d9534f" :
                          ask.importance === "medium" ? "5px solid #f0ad4e" :
                          "5px solid #5bc0de"
            }}
          >
            <div style={{ flex: 2 }}>
              <div style={{ fontSize: "14px", color: "#666" }}>
                📅 {new Date(ask.date_sent).toLocaleDateString()}
              </div>
              <div style={{ fontSize: "16px", color: "#134075", fontWeight: "bold" }}>
                📝 {ask.title}
              </div>
            </div>

            <div style={{ flex: 1, textAlign: "center", fontSize: "14px", color: "#333" }}>
              👤 {ask.id_sending}
            </div>

            <div style={{ flex: 1, textAlign: "right" }}>
              <span style={{
                padding: "6px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#fff",
                backgroundColor:
                  ask.status?.toLowerCase().includes("closed") ? "#5cb85c" :
                  ask.status?.toLowerCase().includes("pending") ? "#6c757d" :
                  ask.status?.includes("בטיפול") ? "#f0ad4e" :
                  "#90900fb0"
              }}>
                {ask.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <RequestModal
        key={selectedAsk?._id || "default"}
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
