import React, { useEffect, useState } from "react";

function RequestModal({ ask, onClose , refreshAsks}) {
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(ask?.text || "");

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  const closeWithAnimation = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleSave = async () => {
    await fetch(`http://localhost:8000/asks/${ask.idr}/edit_text/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ new_text: editedText }),
  });

  setIsEditing(false); // יציאה ממצב עריכה
  refreshAsks();       // ← רענון הרשימה
};

  if (!ask) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
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
        {/* כותרת */}
        <h2 style={{ color: "#134075", marginBottom: "20px" }}>{ask.title}</h2>

        {/* טקסט לעריכה */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "bold" }}>Request Text:</label>
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                marginTop: "5px"
              }}
              rows={4}
            />
          ) : (
            <p style={{
              background: "#f5f7fa",
              padding: "12px",
              borderRadius: "10px",
              whiteSpace: "pre-wrap",
              marginTop: "5px"
            }}>{editedText}</p>
          )}
        </div>

        {/* כפתור עריכה או שמירה */}
        {isEditing ? (
          <button onClick={handleSave} style={buttonStyle}>Save</button>
        ) : (
          <button onClick={() => setIsEditing(true)} style={buttonStyle}>Edit Text</button>
        )}

        {/* פרטים נוספים */}
        <div style={{ marginTop: "25px" }}>
          <p><strong>Importance:</strong> {ask.importance}</p>
          <p><strong>Date Sent:</strong> {new Date(ask.date_sent).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {ask.status}</p>
        </div>

        {/* כפתור סגירה */}
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button onClick={closeWithAnimation} style={{ ...buttonStyle, backgroundColor: "#e0e0e0", color: "#333" }}>
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

export default RequestModal;
