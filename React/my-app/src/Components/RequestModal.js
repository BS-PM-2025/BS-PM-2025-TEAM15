import React, { useEffect, useState } from "react";

function RequestModal({ ask, onClose, admin_id, currentUserName, refreshAsks }) {
  const [emailBack, setEmailBack] = useState("");
  const [noteText, setNoteText] = useState("");
  const [newStatus, setNewStatus] = useState("..");
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/admins/")
      .then(res => res.json())
      .then(data => setAdmins(data));
  }, []);

  const handleStatusChange = async () => {
    if (!ask || newStatus === "..") return;

    const update = {
      status: newStatus === "assigned to me" ? `בטיפול ${currentUserName}` : newStatus,
    };

    if (newStatus === "assigned to me") {
      update.id_receiving = parseInt(admin_id);
    }

    await fetch(`http://localhost:8000/asks/${ask.idr}/update_status/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });

    await refreshAsks(); // keep modal open
  };

  const handleReassign = async () => {
    if (!selectedAdminId) return;

    await fetch(`http://localhost:8000/asks/${ask.idr}/reassign/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_admin_id: parseInt(selectedAdminId) }),
    });

    await refreshAsks(); // reflect changes
    setSelectedAdminId(""); // optional: clear selection
  };

  const handleAddNote = async () => {
    const note = `note from ${currentUserName}: ${noteText}`;
    await fetch(`http://localhost:8000/asks/${ask.idr}/add_note/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: `\n${note}` }),
    });

    alert("Note added");
    setNoteText("");
    await refreshAsks(); // update ask text
  };

  const handleSendEmail = () => {
    alert(`📧 Email sent to student:\n\n${emailBack}`);
    setEmailBack("");
  };

  if (!ask) return null;

  return (
    <>
      <div
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999
        }}
      />
      <div
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white", padding: "25px", borderRadius: "10px",
          zIndex: 1000, width: "90%", maxWidth: "600px", color: "#222"
        }}
      >
        <h3>{ask.title}</h3>
        <p><strong>Text:</strong></p>
        <div style={{ whiteSpace: "pre-wrap", marginBottom: "10px" }}>
          {ask.text}
        </div>

        <p><strong>Importance:</strong> {ask.importance}</p>
        <p><strong>Date Sent:</strong> {new Date(ask.date_sent).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {ask.status}</p>

        <div style={{ marginTop: "15px" }}>
          <label><strong>Change Status:</strong></label>
          <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={{ marginLeft: "10px" }}>
            <option value="..">..</option>
            <option value="pending">Pending</option>
            <option value="assigned to me">בטיפול {currentUserName}</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={handleStatusChange} style={{ marginLeft: "10px" }}>
            Change
          </button>
        </div>

        <div style={{ marginTop: "15px" }}>
          <label><strong>Reassign Ask:</strong></label>
          <select value={selectedAdminId} onChange={e => setSelectedAdminId(e.target.value)} style={{ marginLeft: "10px" }}>
            <option value="">..</option>
            {admins.map(admin => (
              <option key={admin.user_id} value={admin.user_id}>
                {admin.user_id} - {admin.name}
              </option>
            ))}
          </select>
          <button onClick={handleReassign} style={{ marginLeft: "10px" }}>Reassign</button>
        </div>

        <div style={{ marginTop: "15px" }}>
          <label><strong>Add Note:</strong></label><br />
          <input
            type="text"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            style={{ width: "80%", marginRight: "10px" }}
          />
          <button onClick={handleAddNote}>Add Note</button>
        </div>

        <div style={{ marginTop: "15px" }}>
          <label><strong>Email Response:</strong></label><br />
          <textarea
            rows={3}
            value={emailBack}
            onChange={e => setEmailBack(e.target.value)}
            style={{ width: "100%", marginTop: "5px" }}
          />
          <button onClick={handleSendEmail} style={{ marginTop: "5px" }}>Send Email</button>
        </div>

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
}

export default RequestModal;
