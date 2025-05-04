import React, { useEffect, useState } from "react";
import RequestModal from "../Components/RequestModal";

function ViewAsks() {
  const admin_id = 2;
  const [asks, setAsks] = useState([]);
  const [selectedAsk, setSelectedAsk] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [currentUserName] = useState("Admin");

  const [importance, setImportance] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    applyFilters();

    fetch("http://localhost:8000/admins/")
      .then(res => res.json())
      .then(data => setAdmins(data));
  }, []);

  const applyFilters = () => {
    let url = `http://localhost:8000/asks/?`;
    if (importance) url += `importance=${importance}&`;
    if (status) url += `status=${status}&`;
    if (category) url += `category=${category}&`;
    if (sortBy) url += `sort=${sortBy}&order=${sortOrder}&`;
    if (fromDate) url += `from=${fromDate}&`;
    if (toDate) url += `to=${toDate}&`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          ask => ask.id_receiving === admin_id && ask.status !== "closed"
        );
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

  const refreshAsks = () => {
    applyFilters();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Incoming Requests</h2>

      <div style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <label>
          Importance:
          <select value={importance} onChange={e => setImportance(e.target.value)}>
            <option value="">..</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label>
          Status:
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">..</option>
            <option value="pending">Pending</option>
            <option value="assigned to self">Assigned to Self</option>
            <option value="closed">Closed</option>
          </select>
        </label>

        <label>
          Category:
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
          Sort by:
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="">..</option>
            <option value="importance">Importance</option>
            <option value="date">Date Sent</option>
          </select>
        </label>

        <label>
          Order:
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </label>

        <label>
          From:
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        </label>

        <label>
          To:
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        </label>

        <div style={{ display: "flex", gap: "5px" }}>
          <button onClick={applyFilters}>Apply Filters</button>
          <button onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>

      <ul>
        {asks.map((ask) => (
          <li
            key={ask._id}
            onClick={() => setSelectedAsk(ask)}
            style={{ cursor: "pointer", marginBottom: "10px" }}
          >
            <strong>📅 {new Date(ask.date_sent).toLocaleDateString()}</strong> |{" "}
            <strong>📝 {ask.title}</strong> | 👤 Student {ask.id_sending}
          </li>
        ))}
      </ul>

      <RequestModal
        ask={selectedAsk}
        onClose={() => setSelectedAsk(null)}
        currentUserId={admin_id}
        currentUserName={currentUserName}
        admins={admins}
        refreshAsks={refreshAsks}
      />
    </div>
  );
}

export default ViewAsks;
