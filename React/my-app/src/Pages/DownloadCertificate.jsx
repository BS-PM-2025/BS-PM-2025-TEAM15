import React, { useState } from 'react';

function DownloadCertificate() {
  const [selectedDoc, setSelectedDoc] = useState("study");

  const handleDownload = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
    alert("User not logged in.");
    return;
      }
    try {
      const response = await fetch(`http://localhost:8000/api/study-certificate/${userId}/`);

    if (!response.ok) throw new Error('Failed to download document');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const fileName =
      selectedDoc === "study"
        ? "Study_Certificate.pdf"
        : selectedDoc === "medical"
        ? "Medical_Certificate.pdf"
        : "Document.pdf";

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while downloading the document.');
  }
};

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '"Segoe UI", sans-serif',
      color: '#2c3e50',
      padding: '20px'
    },
    card: {
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '40px',
      maxWidth: '450px',
      width: '100%',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      backgroundColor: '#fff',
      textAlign: 'center'
    },
    title: {
      fontSize: '26px',
      fontWeight: '600',
      marginBottom: '25px'
    },
    label: {
      fontSize: '16px',
      marginBottom: '10px',
      display: 'block',
      textAlign: 'left'
    },
    select: {
      fontSize: '16px',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      width: '100%',
      marginBottom: '25px'
    },
    button: {
      fontSize: '16px',
      padding: '12px 24px',
      borderRadius: '6px',
      border: 'none',
      backgroundColor: '#2c3e50',
      color: '#fff',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    buttonHover: {
      backgroundColor: '#1a252f'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Download Personal Document</h2>

        <label htmlFor="docSelect" style={styles.label}>Select document type:</label>
        <select
          id="docSelect"
          value={selectedDoc}
          onChange={(e) => setSelectedDoc(e.target.value)}
          style={styles.select}
        >
          <option value="study">Study Certificate</option>
          <option value="medical">Medical Certificate</option>
        </select>

        <button
          style={styles.button}
          onClick={handleDownload}
          onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          Download Document
        </button>
      </div>
    </div>
  );
}

export default DownloadCertificate;
