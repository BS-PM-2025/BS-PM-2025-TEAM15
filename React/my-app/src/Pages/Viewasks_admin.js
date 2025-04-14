import React, { useEffect, useState } from "react";
import RequestModal from "../Components/RequestModal";

function ViewAsks() {
  const currentUserId = 2;
  const [currentUserName, setCurrentUserName] = useState("Admin");
  const [asks, setAsks] = useState([]);
  const [selectedAsk, setSelectedAsk] = useState(null);
  const [admins, setAdmins] = useState([]);

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

  const refreshAsks = () => {
    fetch("http://localhost:8000/asks/")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          ask => ask.id_receiving === currentUserId && ask.status !== "closed"
        );
        setAsks(filtered);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Incoming Requests</h2>
      <ul>
        {asks.map((ask) => (
          <li
            key={ask._id}
            onClick={() => setSelectedAsk(ask)}
            style={{ cursor: "pointer", marginBottom: "10px" }}
          >
            <strong>📅 {new Date(ask.date_sent).toLocaleDateString()}</strong> | <strong>📝 {ask.title}</strong> | 👤 Student {ask.id_sending}
          </li>
        ))}
      </ul>

      <RequestModal
        ask={selectedAsk}
        onClose={() => setSelectedAsk(null)}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        admins={admins}
        refreshAsks={refreshAsks}
      />
    </div>
  );
}

export default ViewAsks;
