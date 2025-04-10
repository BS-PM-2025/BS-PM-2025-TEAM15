import React, { useEffect, useState } from "react";

function ViewAsks() {
  const currentUserId = 2;
  const [currentUserName, setCurrentUserName] = useState("Admin");
  const [asks, setAsks] = useState([]);
  const [selectedAsk, setSelectedAsk] = useState(null);
  const [emailBack, setEmailBack] = useState("");
  const [admins, setAdmins] = useState([]);
  const [newStatus, setNewStatus] = useState("pending");
  const [noteText, setNoteText] = useState("");
  const [selectedAdminId, setSelectedAdminId] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/asks/")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          ask => ask.id_receiving === currentUserId && ask.status !== "closed"
        );
        setAsks(filtered);
      });

    fetch("http://localhost:8000/admins/")
      .then(res => res.json())
      .then(data => {
        setAdmins(data);
        const current = data.find(admin => admin.user_id === currentUserId);
        if (current) setCurrentUserName(current.name);
      });
  }, []);

  const handleReassignAsk = () => {
    if (!selectedAdminId) return;
    fetch(`http://localhost:8000/asks/${selectedAsk._id}/reassign/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_admin_id: selectedAdminId })
    }).then(() => {
      setAsks(asks.filter(a => a._id !== selectedAsk._id));
      setSelectedAsk(null);
      setSelectedAdminId("");
    });
  };

  const handleStatusChange = () => {
    let updatedStatus = newStatus;
    const update = {};

    if (newStatus === "assigned to me") {
      updatedStatus = `בטיפול ${currentUserName}`;
      update.id_receiving = currentUserId;
    }

    update.status = updatedStatus;

    fetch(`http://localhost:8000/asks/${selectedAsk._id}/update_status/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update)
    }).then(() => {
      fetch(`http://localhost:8000/asks/${selectedAsk._id}/add_note/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: `status changed to '${updatedStatus}' by ${currentUserName}`
        })
      });
      setAsks(asks.filter(a => a._id !== selectedAsk._id));
      setSelectedAsk(null);
    });
  };

  const handleSendEmail = () => {
    alert("\ud83d\udce7 Email sent to student:\n\n" + emailBack);
    setEmailBack("");
  };

  const handleAddNote = () => {
    const note = `note from ${currentUserName}: ${noteText}`;
    const updatedText = `${selectedAsk.text}\n${note}`;

    fetch(`http://localhost:8000/asks/${selectedAsk._id}/update_status/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: updatedText })
    }).then(() => {
      alert("Note added: " + note);
      setNoteText("");
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Incoming Requests</h2>
      <ul>
        {asks.map((ask) => (
          <li
            key={ask._id}
            onClick={() => {
              setSelectedAsk(ask);
              setNewStatus(ask.status);
            }}
            style={{ cursor: "pointer", marginBottom: "10px" }}
          >
            📅 {new Date(ask.date_sent).toLocaleDateString()} | 📝 {ask.title} | 👤 Student {ask.id_sending}
          </li>
        ))}
      </ul>

      {selectedAsk && (
        <>
          <div
            onClick={() => setSelectedAsk(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999
            }}
          />

          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              border: "2px solid #444",
              borderRadius: "10px",
              padding: "30px",
              zIndex: 1000,
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              color: "#222"
            }}
          >
            <div style={{ textAlign: "right" }}>
              <button onClick={() => setSelectedAsk(null)} style={{ fontSize: "16px", fontWeight: "bold" }}>
                ✖
              </button>
            </div>

            <h3>{selectedAsk.title}</h3>
            <p><strong>Text:</strong> {selectedAsk.text}</p>
            <p><strong>Importance:</strong> {selectedAsk.importance}</p>
            <p><strong>Student ID:</strong> {selectedAsk.id_sending}</p>
            <p><strong>Status:</strong> {selectedAsk.status}</p>

            <div style={{ marginTop: "20px" }}>
              <label><strong>Reassign Ask:</strong></label>
              <select
                value={selectedAdminId}
                onChange={e => setSelectedAdminId(e.target.value)}
                style={{ marginLeft: "10px" }}
              >
                <option value="">Select Admin</option>
                {admins.map(admin => (
                  <option key={admin.user_id} value={admin.user_id}>
                    {admin.user_id} - {admin.name}
                  </option>
                ))}
              </select>
              <button onClick={handleReassignAsk} style={{ marginLeft: "10px" }}>
                Reassign
              </button>
            </div>

            <div style={{ marginTop: "20px" }}>
              <label><strong>Change Status:</strong></label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                style={{ marginLeft: "10px" }}
              >
                <option value="pending">Pending</option>
                <option value="assigned to me">בטיפול {currentUserName}</option>
                <option value="closed">Closed</option>
              </select>
              <button onClick={handleStatusChange} style={{ marginLeft: "10px" }}>
                Change
              </button>
            </div>

            <div style={{ marginTop: "20px" }}>
              <label><strong>Add a Note:</strong></label><br />
              <input
                type="text"
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                style={{ width: "80%", marginRight: "10px" }}
              />
              <button onClick={handleAddNote}>Add Note</button>
            </div>

            <div style={{ marginTop: "20px" }}>
              <label><strong>Email response:</strong></label><br />
              <textarea
                value={emailBack}
                onChange={e => setEmailBack(e.target.value)}
                rows={3}
                cols={40}
                style={{ marginTop: "5px", fontFamily: "inherit" }}
              />
              <br />
              <button onClick={handleSendEmail} style={{ marginTop: "5px" }}>
                Send Email
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ViewAsks;
