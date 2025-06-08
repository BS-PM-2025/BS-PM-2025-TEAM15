import React, { useEffect, useState } from "react";

function RequestModal({ ask, onClose, admin_id, currentUserName, refreshAsks }) {
  const [emailBack, setEmailBack] = useState("");
  const [noteText, setNoteText] = useState("");
  const [newStatus, setNewStatus] = useState("..");
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [admins, setAdmins] = useState([]);
  const [visible, setVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  const fetchComments = async () => {
    const res = await fetch(`http://localhost:8000/comments/${ask.idr}/`);
    const data = await res.json();
    setCommentText(data.text || "");
  };

  useEffect(() => {
    fetch("http://localhost:8000/admins/")
      .then(res => res.json())
      .then(data => setAdmins(data));

    if (ask) fetchComments();

    setTimeout(() => setVisible(true), 10);
  }, [ask]);

  const closeWithAnimation = () => {
    setVisible(false);
    setTimeout(onClose, 200);
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

  const res = await fetch(`http://localhost:8000/asks/${ask.idr}/update_status/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });

  if (res.ok) {
    ask.status = updatedStatus;
    if (update.id_receiving) ask.id_receiving = update.id_receiving;
    setNewStatus("..");
    refreshAsks();

    // ✏️ Add note about status change
    const statusNote = `admin: changed status to "${updatedStatus}"`;
    await fetch(`http://localhost:8000/asks/${ask.idr}/add_note/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: statusNote }),
    });

    fetchComments(); // refresh comments tab if open
  }
};


  const handleReassign = async () => {
  if (!selectedAdminId) return;

  const res = await fetch(`http://localhost:8000/asks/${ask.idr}/reassign/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ new_admin_id: parseInt(selectedAdminId) }),
  });

  if (res.ok) {
    ask.id_receiving = parseInt(selectedAdminId);
    ask.status = "pending";
    const reassignedAdmin = admins.find(a => a.user_id === parseInt(selectedAdminId));
    const name = reassignedAdmin?.name || `ID ${selectedAdminId}`;
    setSelectedAdminId("");
    refreshAsks();

    // ✏️ Add note about reassignment
    const reassignNote = `admin: reassigned ask to ${name}`;
    await fetch(`http://localhost:8000/asks/${ask.idr}/add_note/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: reassignNote }),
    });

    fetchComments(); // update comment view
  }
};


 const handleAddNote = async () => {
  if (!noteText.trim()) return;

  const noteToSend = noteText.toLowerCase().startsWith("admin:")
    ? noteText
    : `admin: ${noteText.trim()}`;

  const res = await fetch(`http://localhost:8000/asks/${ask.idr}/add_note/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note: noteToSend }),
  });

  if (res.ok) {
    setCommentText(prev => {
      const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
      const newLine = `[${timestamp}] ${noteToSend}`;
      return prev ? `${prev}\n${newLine}` : newLine;
    });
    setNoteText("");
  } else {
    alert("Failed to add note.");
  }
};


  const handleSendEmail = () => {
    alert(`📧 Email sent to student:\n\n${emailBack}`);
    setEmailBack("");
  };

  const renderCommentBubbles = () => {
  return commentText.split("\n").map((line, i) => {
    const raw = line.trim();

    // Extract timestamp and message
    const timestampMatch = raw.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]\s*(.*)$/);
    const timestamp = timestampMatch ? timestampMatch[1] : "";
    const message = timestampMatch ? timestampMatch[2] : raw;

    const isAdmin = message.toLowerCase().startsWith("admin:");
    const isStudent = message.toLowerCase().startsWith("student:");

    return (
      <div key={i} style={{
        alignSelf: isAdmin ? "flex-end" : "flex-start",
        maxWidth: "80%",
        marginBottom: "10px"
      }}>
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "3px" }}>
          {timestamp}
        </div>
        <div style={{
          backgroundColor: isAdmin ? "#d4f4dd" : isStudent ? "#d0e8ff" : "#eee",
          padding: "10px",
          borderRadius: "10px",
          whiteSpace: "pre-wrap"
        }}>
          {message}
        </div>
      </div>
    );
  });
};


  if (!ask) return null;

  return (
    <>
      <div
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999,
          opacity: visible ? 1 : 0, transition: "opacity 0.2s ease"
        }}
        onClick={closeWithAnimation}
      />
      <div
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: visible ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.9)",
          transition: "transform 0.2s ease, opacity 0.2s ease",
          background: "#fff", borderRadius: "16px",
          padding: "25px", width: "520px", height: "600px",
          overflowY: "auto", zIndex: 1000,
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          fontFamily: "sans-serif", color: "#1a1a1a",
          opacity: visible ? 1 : 0
        }}
      >
        <h2 style={{ color: "#134075", marginBottom: "10px" }}>{ask.title}</h2>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          <button
            style={{ ...tabButtonStyle, backgroundColor: activeTab === "info" ? "#134075" : "#ccc" }}
            onClick={() => setActiveTab("info")}
          >
            📄 Info
          </button>
          <button
            style={{ ...tabButtonStyle, backgroundColor: activeTab === "comments" ? "#134075" : "#ccc" }}
            onClick={() => { setActiveTab("comments"); fetchComments(); }}
          >
            💬 Comments
          </button>
        </div>

        {/* Info Tab Content */}
        {activeTab === "info" && (
          <>
            <div style={{ marginBottom: "15px" }}>
              <strong>Text:</strong>
              <p style={{
                background: "#f5f7fa", padding: "12px",
                borderRadius: "10px", whiteSpace: "pre-wrap", marginTop: "5px"
              }}>{ask.text}</p>
            </div>

            <p><strong>Importance:</strong> {ask.importance}</p>
            <p><strong>Date Sent:</strong> {new Date(ask.date_sent).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {ask.status}</p>

            <hr style={{ margin: "20px 0" }} />

            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
              <label><strong>Change Status:</strong></label>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={selectStyle}>
                <option value="..">..</option>
                <option value="pending">Pending</option>
                <option value="assigned to me">בטיפול {currentUserName}</option>
                <option value="closed">Closed</option>
              </select>
              <button onClick={handleStatusChange} style={buttonStyle}>Change</button>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
              <label><strong>Reassign Ask:</strong></label>
              <select value={selectedAdminId} onChange={e => setSelectedAdminId(e.target.value)} style={selectStyle}>
                <option value="">..</option>
                {admins.map(admin => (
                  <option key={admin.user_id} value={admin.user_id}>
                    {admin.user_id} - {admin.name}
                  </option>
                ))}
              </select>
              <button onClick={handleReassign} style={buttonStyle}>Reassign</button>
            </div>

            {ask.documents && ask.documents.length > 0 ? (
              <div style={{ marginBottom: "15px" }}>
                <button
                  onClick={() => window.open(`http://localhost:8000/asks/${ask.idr}/download_documents/`, '_blank')}
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

            <div style={{ marginTop: "20px", marginBottom: "15px" }}>
              <label><strong>Email Response:</strong></label><br />
              <textarea
                rows={4} value={emailBack}
                onChange={e => setEmailBack(e.target.value)}
                placeholder="Type your email response here..."
                style={{
                  width: "100%", padding: "10px", borderRadius: "10px",
                  border: "1px solid #ccc", backgroundColor: emailBack.trim() === "" ? "#e8f0fe" : "white"
                }}
              />
              <button onClick={handleSendEmail} style={{ ...buttonStyle, marginTop: "5px" }}>Send Email</button>
            </div>
          </>
        )}

        {/* Comments Tab Content */}
        {activeTab === "comments" && (
          <>
            <h3 style={{ color: "#134075", marginBottom: "10px" }}>💬 Comments</h3>
            <div style={{
              display: "flex", flexDirection: "column",
              maxHeight: "250px", overflowY: "auto",
              gap: "6px", background: "#f7f9fb",
              padding: "10px", borderRadius: "12px"
            }}>
              {renderCommentBubbles()}
            </div>

            <div style={{ marginTop: "15px" }}>
              <input
                type="text" value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Type a note..."
                style={{
                  width: "100%", padding: "10px", borderRadius: "10px",
                  border: "1px solid #ccc", backgroundColor: noteText.trim() === "" ? "#e8f0fe" : "white"
                }}
              />
              <button onClick={handleAddNote} style={{ ...buttonStyle, marginTop: "5px" }}>Add Note</button>
            </div>
          </>
        )}

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

const tabButtonStyle = {
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  color: "white",
  cursor: "pointer"
};

const selectStyle = {
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

export default RequestModal;
