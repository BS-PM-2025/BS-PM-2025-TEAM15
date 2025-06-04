import React, { useEffect, useState } from "react";

function RequestModal({ ask, onClose, admin_id, currentUserName, refreshAsks }) {
  const [emailBack, setEmailBack] = useState("");
  const [noteText, setNoteText] = useState("");
  const [newStatus, setNewStatus] = useState("..");
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [admins, setAdmins] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/admins/")
      .then(res => res.json())
      .then(data => setAdmins(data));

    // trigger open animation
    setTimeout(() => setVisible(true), 10);
  }, []);

  const closeWithAnimation = () => {
    setVisible(false);
    setTimeout(onClose, 200); // match transition duration
  };

  const handleStatusChange = async () => {
  if (!ask || newStatus === "..") return;

  const updatedStatus = newStatus === "assigned to me"
    ? `בטיפול ${currentUserName}`
    : newStatus;

  const update = { status: updatedStatus };
  if (newStatus === "assigned to me") {
    update.id_receiving = parseInt(admin_id);
  }

  // Send update to backend
  const res = await fetch(`http://localhost:8000/asks/${ask.idr}/update_status/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });

  if (res.ok) {
    // 🟢 Update UI immediately
    await refreshAsks();
   
  }

  
};


  const handleReassign = async () => {
    if (!selectedAdminId) return;

    await fetch(`http://localhost:8000/asks/${ask.idr}/reassign/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_admin_id: parseInt(selectedAdminId) }),
    });

    await refreshAsks();
    setSelectedAdminId("");
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
    await refreshAsks();
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
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 999,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease"
        }}
        onClick={closeWithAnimation}
      />
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: visible ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.9)",
          transition: "transform 0.2s ease, opacity 0.2s ease",
          background: "#fff",
          borderRadius: "16px",
          padding: "25px",
          width: "90%", maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          zIndex: 1000,
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          fontFamily: "sans-serif",
          color: "#1a1a1a",
          opacity: visible ? 1 : 0
        }}
      >
        <h2 style={{ color: "#134075", marginBottom: "10px" }}>{ask.title}</h2>
        <div style={{ marginBottom: "15px" }}>
          <strong>Text:</strong>
          <p style={{
            background: "#f5f7fa",
            padding: "12px",
            borderRadius: "10px",
            whiteSpace: "pre-wrap",
            marginTop: "5px"
          }}>{ask.text}</p>
        </div>

        <p><strong>Importance:</strong> {ask.importance}</p>
        <p><strong>Date Sent:</strong> {new Date(ask.date_sent).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {ask.status}</p>

        <hr style={{ margin: "20px 0" }} />

        {/* Change Status */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
          <label><strong>Change Status:</strong></label>
          <select
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
            style={{
              ...selectStyle,
              backgroundColor: newStatus === ".." ? "#e8f0fe" : "white"
            }}
          >
            <option value="..">..</option>
            <option value="pending">Pending</option>
            <option value="assigned to me">בטיפול {currentUserName}</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={handleStatusChange} style={buttonStyle}>Change</button>
        </div>

        {/* Reassign */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
          <label><strong>Reassign Ask:</strong></label>
          <select
            value={selectedAdminId}
            onChange={e => setSelectedAdminId(e.target.value)}
            style={{
              ...selectStyle,
              backgroundColor: selectedAdminId === "" ? "#e8f0fe" : "white"
            }}
          >
            <option value="">..</option>
            {admins.map(admin => (
              <option key={admin.user_id} value={admin.user_id}>
                {admin.user_id} - {admin.name}
              </option>
            ))}
          </select>
          <button onClick={handleReassign} style={buttonStyle}>Reassign</button>
        </div>

        {/* Note */}
        <div style={{ marginBottom: "15px" }}>
          <label><strong>Add Note:</strong></label><br />
          <input
            type="text"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Type a note..."
            style={{
              width: "100%", padding: "10px",
              borderRadius: "10px", border: "1px solid #ccc",
              backgroundColor: noteText.trim() === "" ? "#e8f0fe" : "white"
            }}
          />
          <button onClick={handleAddNote} style={{ ...buttonStyle, marginTop: "5px" }}>Add Note</button>
        </div>

{ask.documents && ask.documents.length > 0 ? (
  <div style={{ marginBottom: "15px" }}>
    <button
      onClick={() => {
        window.open(`http://localhost:8000/asks/${ask.idr}/download_documents/`, '_blank');
      }}
      style={{ ...buttonStyle, backgroundColor: "#4CAF50" }}
    >
      📁 Download All Files
    </button>
  </div>
) : (
  <p style={{ fontStyle: "italic", color: "gray", marginBottom: "15px" }}>
    No documents available to download.
  </p>
)}


        {/* Email */}
        <div style={{ marginBottom: "15px" }}>
          <label><strong>Email Response:</strong></label><br />
          <textarea
            rows={4}
            value={emailBack}
            onChange={e => setEmailBack(e.target.value)}
            placeholder="Type your email response here..."
            style={{
              width: "100%", padding: "10px",
              borderRadius: "10px", border: "1px solid #ccc",
              marginTop: "5px",
              backgroundColor: emailBack.trim() === "" ? "#e8f0fe" : "white"
            }}
          />
          <button onClick={handleSendEmail} style={{ ...buttonStyle, marginTop: "5px" }}>Send Email</button>
        </div>

        {/* Close */}
        <div style={{ textAlign: "right" }}>
          <button onClick={closeWithAnimation} style={{ ...buttonStyle, backgroundColor: "#e0e0e0", color: "#333" }}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}

const buttonStyle = {
  padding: "8px 14px",
  backgroundColor: "#134075",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const selectStyle = {
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

export default RequestModal;
