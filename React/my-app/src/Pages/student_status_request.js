import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentStatusRequest = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/request_status/")
            .then(res => setRequests(res.data))
            .catch(err => console.log(err));
    }, []);

    const styles = {
        page: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(to right, #00c6ff, #7a00ff)',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            padding: '20px'
        },
        title: {
            fontSize: '2.2em',
            fontWeight: 'bold',
            marginBottom: '20px'
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

    return (
        <div style={styles.page}>
            <h2 style={styles.title}>My Requests Status</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Request ID</th>
                        <th style={styles.th}>Details</th>
                        <th style={styles.th}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req, index) => (
                        <tr key={index}>
                            <td style={styles.td}>{req.id_sending}</td>
                            <td style={styles.td}>{req.importance}</td>
                            <td style={styles.td}>{req.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentStatusRequest;
