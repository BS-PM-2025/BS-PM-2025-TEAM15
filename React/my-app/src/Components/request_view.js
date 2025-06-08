import React, { useEffect, useState } from "react";

function Request_view({ ask, onClose, refreshAsks }) {
  const [visible, setVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [studentNote, setStudentNote] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (ask?.idr !== undefined) fetchComments();
    setTimeout(() => setVisible(true), 10);
  }, [ask]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8000/comments/${ask.idr}/`);
      const data = await res.json();
      setCommentText(data.text || "");
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const closeWithAnimation = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleAddStudentNote = async () => {
    if (!studentNote.trim()) return;

    const noteToSend = studentNote.toLowerCase().startsWith("student:")
      ? studentNote
      : `student: ${studentNote}`;

    const res = await fetch(`http://localhost:8000/asks/${ask.idr}/add_note/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: noteToSend }),
    });

    if (res.ok) {
      fetchComments();
      setStudentNote("");
    } else {
      alert("Failed to add student note.");
    }
  };

  const renderCommentBubbles = () => {
    return commentText.split("\n").map((line, i) => {
      const raw = line.trim();

      const timestampMatch = raw.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]\s*(.*)$/);
      const timestamp = timestampMatch ? timestampMatch[1] : "";
      const message = timestampMatch ? timestampMatch[2] : raw;

      const isStudent = message.toLowerCase().startsWith("student:");
      const isAdmin = message.toLowerCase().startsWith("admin:");

      return (
        <div key={i} style={{
          alignSelf: isStudent ? "flex-end" : "flex-start",
          maxWidth: "80%",
          marginBottom: "10px"
        }}>
          <div style={{ fontSize: "12px", color: "#777", marginBottom: "3px" }}>{timestamp}</div>
          <div style={{
            backgroundColor: isStudent ? "#d0e8ff" : isAdmin ? "#d4f4dd" : "#eee",
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
          padding: "25px", width: "90%", maxWidth: "520px", maxHeight: "90vh",
          overflowY: "auto", zIndex: 1000,
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          fontFamily: "sans-serif", color: "#1a1a1a",
          opacity: visible ? 1 : 0
        }}
      >
        <h2 style={{ color: "#134075", marginBottom: "15px" }}>{ask.title}</h2>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          <button
            style={{ ...tabButtonStyle, backgroundColor: activeTab === "info" ? "#3f51b5" : "#ccc" }}
            onClick={() => setActiveTab("info")}
          >
            📄 Info
          </button>
          <button
            style={{ ...tabButtonStyle, backgroundColor: activeTab === "comments" ? "#3f51b5" : "#ccc" }}
            onClick={() => { setActiveTab("comments"); fetchComments(); }}
          >
            💬 Comments
          </button>
        </div>

        {activeTab === "info" && (
          <>
            <div style={{ marginBottom: "15px" }}>
              <strong>Request Text:</strong>
              <p style={{
                background: "#f5f7fa", padding: "12px",
                borderRadius: "10px", whiteSpace: "pre-wrap", marginTop: "5px"
              }}>{ask.text}</p>
            </div>

            <p><strong>Importance:</strong> {ask.importance}</p>
            <p><strong>Date Sent:</strong> {new Date(ask.date_sent).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {ask.status}</p>
          </>
        )}

        {activeTab === "comments" && (
          <>
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
                type="text"
                value={studentNote}
                onChange={(e) => setStudentNote(e.target.value)}
                placeholder="Type your comment..."
                style={{
                  width: "100%", padding: "10px", borderRadius: "10px",
                  border: "1px solid #ccc", backgroundColor: studentNote.trim() === "" ? "#e8f0fe" : "white"
                }}
              />
              <button onClick={handleAddStudentNote} style={buttonStyle}>Add Comment</button>
            </div>
          </>
        )}

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button
            onClick={closeWithAnimation}
            style={{
              ...buttonStyle,
              backgroundColor: "#e0e0e0",
              color: "#333"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

const buttonStyle = {
  padding: "10px 18px",
  backgroundColor: "#3f51b5",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "10px"
};

const tabButtonStyle = {
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  color: "white",
  cursor: "pointer"
};

export default Request_view;
