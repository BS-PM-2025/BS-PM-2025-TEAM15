import React, { useEffect, useState } from 'react';
import axios from 'axios';

const user_id  = localStorage.getItem('user_id');  

const StudentStatusRequest = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/request_status/?user_id=${user_id}`)
            .then(res => setRequests(res.data))
            .catch(err => console.log(err));
    }, []);
    // פילטור לפי סטטוס
    const doneRequests = requests.filter(req => req.status?.toLowerCase() === 'done');
    const otherRequests = requests.filter(req => req.status?.toLowerCase() !== 'done');

    const styles = {
        page: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start', // ✅ right-align content
      justifyContent: 'flex-start',
      minHeight: '100vh',
      width: '100%',
      padding: '40px',
      backgroundColor: 'rgba(128, 128, 128, 0.5)', // ✅ transparent gray
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
    },
        title: {
            fontSize: '2.2em',
            fontWeight: 'bold',
            marginBottom: '20px'
        },
        scrollContainer: {
            maxHeight: '300px',
            overflowY: 'auto',
            width: '80%',
            maxWidth: '800px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
        },
        table: {
            borderCollapse: 'collapse',
            width: '80%',
            maxWidth: '800px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
        },
        th: {
            border: '1px solid white',
            padding: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            fontWeight: 'bold'
        },
        td: {
            border: '1px solid white',
            padding: '10px'
        }
    };
 // פונקציה ליצירת טבלה לפי רשימה
 const renderTable = (title, data) => (
    <>
    <h3 style={styles.sectionTitle}>{title}</h3>
    <div style={styles.scrollContainer}>
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>Request ID</th>
                    <th style={styles.th}>Details</th>
                    <th style={styles.th}>Status</th>
                </tr>
            </thead>
            <tbody>
                {data.map((req, index) => (
                    <tr key={index}>
                        <td style={styles.td}>{req.id_sending}</td>
                        <td style={styles.td}>{req.importance}</td>
                        <td style={styles.td}>{req.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</>
);

const renderDoneTable = (title, data) => (
<>
    <h3 style={styles.sectionTitle}>{title}</h3>
    <div style={styles.scrollContainer}>
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>Request ID</th>
                    <th style={styles.th}>Details</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Completed At</th> {/* ✅ תאריך סיום */}
                    <th style={styles.th}>Response</th>      {/* ✅ תגובה */}
                </tr>
            </thead>
            <tbody>
                {data.map((req, index) => (
                    <tr key={index}>
                        <td style={styles.td}>{req.id_sending}</td>
                        <td style={styles.td}>{req.importance}</td>
                        <td style={styles.td}>{req.status}</td>
                        <td style={styles.td}>
                            {req.done_date 
                                ? new Date(req.done_date).toLocaleString() 
                                : 'N/A'}
                        </td>
                        <td style={styles.td}>{req.response_text || 'No response'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</>
);

    return (
        <div style={styles.page}>
            <h2 style={styles.title}>My Requests Status</h2>
            {renderTable('Pending / In Progress Requests', otherRequests)}
            {renderDoneTable('Done Requests', doneRequests)}

        </div>
    );
};

export default StudentStatusRequest;