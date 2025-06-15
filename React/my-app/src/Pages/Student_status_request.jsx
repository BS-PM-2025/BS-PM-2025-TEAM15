import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Request_view from "../Components/Request_view"; // ודא שהנתיב נכון

const Student_status_request = () => {
  const user_id = localStorage.getItem('user_id');
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);


  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/request_status/?user_id=${user_id}`)
      .then((res) => setRequests(res.data))
      .catch((err) => console.log(err));
  }, []);

  const doneRequests = requests.filter(req => req.status?.toLowerCase() === 'done');
  const otherRequests = requests.filter(req => req.status?.toLowerCase() !== 'done');

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'done':
        return '#d4edda'; // green
      case 'pending':
        return '#fff3cd'; // yellow
      case 'rejected':
        return '#f8d7da'; // red
      default:
        return '#e2e3e5'; // gray
    }
  };

  const renderCard = (req) => (
    <div
      key={req.id_sending}
      className="request-card"
      style={{ backgroundColor: getStatusColor(req.status) }}
    >
      <div className="card-header">
        <strong>Request ID: {req.idr}</strong>
        <span>{new Date(req.done_date || req.created_at).toLocaleDateString()}</span>
      </div>
      <div className="card-body">
        <p><strong>Subject:</strong> {req.importance}</p>
        <p><strong>Status:</strong> {req.status}</p>
        {req.status?.toLowerCase() === 'done' && (
          <>
            <p><strong>Completed At:</strong> {new Date(req.done_date).toLocaleString()}</p>
            <p><strong>Response:</strong> {req.response_text || 'No response provided'}</p>
          </>
        )}
        <button className="view-btn" onClick={() => setSelectedRequest(req)}>View</button>
      </div>
    </div>
  );

  return (
  <div className="status-page">
    <h1 className="page-title">My Requests Status</h1>
    <p className="subtitle">
      Here you can track the status of your submitted requests. Click "View" to see full details.
    </p>

    <h2 className="section-title">Pending / In Progress Requests</h2>
    <div className="request-list">
      {otherRequests.length ? otherRequests.map(renderCard) : <p>No pending requests found.</p>}
    </div>

    <h2 className="section-title">Completed Requests</h2>
    <div className="request-list">
      {doneRequests.length ? doneRequests.map(renderCard) : <p>No completed requests found.</p>}
    </div>

    {/*  Modal for viewing/editing a request */}
    {selectedRequest && (
      <Request_view
        ask={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        refreshAsks={async () => {
          try {
            const res = await axios.get(
              `http://127.0.0.1:8000/api/request_status/?user_id=${user_id}`
            );
            setRequests(res.data);
          } catch (err) {
            console.error("🔴 Failed to refresh requests:", err);
          }
        }}
      />
    )}
      {/* Embedded CSS */}
      <style>{`
        .status-page {
          font-family: 'Poppins', sans-serif;
          padding: 40px 20px;
          background-color: #f7f9fc;
          min-height: 100vh;
          direction: ltr;
          text-align: left;
        }

        .page-title {
          font-size: 2.5em;
          font-weight: bold;
          margin-bottom: 0.3em;
          color: #2b2b2b;
        }

        .subtitle {
          color: #555;
          margin-bottom: 2em;
        }

        .section-title {
          font-size: 1.4em;
          color: #333;
          margin: 1.5em 0 1em;
          border-bottom: 2px solid #ccc;
          padding-bottom: 5px;
        }

        .request-list {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        .request-card {
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 0 8px rgba(0,0,0,0.1);
          background-color: #fff;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5em;
          font-size: 1em;
          font-weight: bold;
        }

        .card-body p {
          margin: 5px 0;
        }
         
        .scrollable-list {
         max-height: 400px; /* or any value that fits your layout */
         overflow-y: auto;
         padding-right: 8px; /* for scrollbar spacing */
        }


        .view-btn {
          margin-top: 10px;
          padding: 8px 16px;
          background-color: #3f51b5;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .view-btn:hover {
          background-color: #303f9f;
        }
      `}</style>
    </div>
  );
};

export default Student_status_request;