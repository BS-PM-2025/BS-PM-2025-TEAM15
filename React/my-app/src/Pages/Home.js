import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toplayer from './pics/toplayer.png';
import RequestModal from '../Components/RequestModal';
import Request_view from "../Components/Request_view";

function Home_test() {
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalRequests: 0,
    doneRequests: 0,
    IN_progress: 0,
    pendingRequests: 0,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [latestAsks, setLatestAsks] = useState([]);
  const [selectedAsk, setSelectedAsk] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [currentUserName, setCurrentUserName] = useState("User");

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (userId) {
      axios.post("http://localhost:8000/api/users/Home", {
        _id: parseInt(userId)
      }).then(res => setUserName(res.data.name))
        .catch(err => console.error("Error fetching user name:", err));

      axios.get(`http://localhost:8000/api/stats/${userId}`)
        .then(res => setStats(res.data))
        .catch(err => console.error("Error fetching stats:", err));

      axios.post("http://localhost:8000/api/isadmin/", {
        userId: parseInt(userId)
      }).then(res => {
        const isAdminUser = res.data.is_admin;
        setIsAdmin(isAdminUser);

        if (isAdminUser) {
          fetch(`http://localhost:8000/asks/?admin_id=${userId}&sort=date&order=desc`)
            .then(res => res.json())
            .then(data => setLatestAsks(data.slice(0, 4)))
            .catch(err => console.error("Error fetching asks:", err));

          fetch("http://localhost:8000/admins/")
            .then(res => res.json())
            .then(data => {
              setAdmins(data);
              const current = data.find(a => parseInt(a.user_id) === parseInt(userId));
              setCurrentUserName(current?.name || "Unknown Admin");
            });
        } else {
          fetch(`http://localhost:8000/api/request_status/?user_id=${userId}`)
            .then(res => res.json())
            .then(data => setLatestAsks(data.slice(0, 4)))
            .catch(err => console.error("Error fetching student asks:", err));
        }
      });
    }
  }, [userId]);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div style={styles.container}>
      <div style={{ ...styles.heroContainer }}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroBlurEdges}></div>

        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Welcome to Askii</h1>
          <h4 style={styles.heroSubtitle}>הישאר מעודכן בכל עת בבקשות שלך!</h4>
          <p style={styles.heroCaption}>Your academic request system</p>
        </div>
        <div style={styles.appName}>Askii</div>
      </div>

      {userName ? (
        <h2 style={styles.hello}>Hello {userName} 👋 </h2>
      ) : (
        <h2 style={styles.loading}>Loading user name...</h2>
      )}
      <p style={styles.dateText}>📅 {today}</p>

      <div style={styles.statsContainer}>
        <div style={styles.card}>📨 Total Requests<br /><strong>{stats.totalRequests}</strong></div>
        <div style={styles.card}>✅ Approved Requests<br /><strong>{stats.doneRequests}</strong></div>
        <div style={styles.card}>🕓 Requests in Progress<br /><strong>{stats.IN_progress}</strong></div>
        <div style={styles.card}>⏳ Pending Requests<br /><strong>{stats.pendingRequests}</strong></div>
      </div>

      <div style={styles.askSection}>
        <h3 style={styles.sectionTitle}>📝 Latest Requests</h3>
        <div style={styles.askLayer}>
          {latestAsks.map((ask) =>
            
              <div key={ask._id} style={{ ...styles.askCard, cursor: 'pointer' }} onClick={() => setSelectedAsk(ask)}>
                <div style={styles.askTitle}>{ask.title}</div>
                <div style={styles.askStatus}>Status: {ask.status}</div>
              </div>
           
            
          )}
        </div>
        <div style={styles.buttonContainer}>
          <button
            style={styles.watchAllButton}
            onClick={() => {
              const url = isAdmin ? "/asks" : "/Student_status_request";
              window.location.href = url;
            }}
          >
            Watch All →
          </button>
        </div>
      </div>

    

      {isAdmin && selectedAsk&&(
        <RequestModal
          ask={selectedAsk}
          onClose={() => setSelectedAsk(null)}
          admin_id={parseInt(userId)}
          currentUserName={currentUserName}
          admins={admins}
          refreshAsks={() => {}}
        />
      )}
    

    {!isAdmin && selectedAsk && (
  <Request_view
    ask={selectedAsk}
    onClose={() => setSelectedAsk(null)}
    refreshAsks={async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/request_status/?user_id=${userId}`
        );
        setLatestAsks(res.data.slice(0, 4));
      } catch (err) {
        console.error("🔴 Failed to refresh requests:", err);
      }
    }}
  />
)}
</div>
  );
}


const styles = {
  heroContainer: {
  width: '100%',
  height: '200px',
backgroundImage: `
  radial-gradient(ellipse at center, transparent 60%, rgb(192, 192, 192) 100%),
  url(${toplayer})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '60px',     // space below hero
  position: 'relative',     // ❗ DO NOT use fixed or sticky here
  zIndex: 0,

},

askLayer: {
  display: 'flex',
  flexDirection: 'column', // stack ask cards
  gap: '10px',
  width: '40%',
  height: '100px',          // ✅ fixed height
  overflowY: 'auto',        // ✅ enable vertical scroll
  paddingRight: '5px' ,      // optional: prevents scrollbar overlap

},

askCard: {
  width: '100%',
  height: '50px',
  borderRadius: '19px',
  background: 'rgba(159, 167, 228, 0.33)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 20px',
  fontFamily: 'Poppins, sans-serif',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  color: '#134075'
},
askTitle: {
  fontSize: '17px',
  fontWeight: 400,
  textAlign: 'left'
},
askStatus: {
  fontSize: '14px',
  fontWeight: 300,
  opacity: 0.8,
  textAlign: 'right'
},


watchAllButton: {
  backgroundColor: ' #134075',
  color: '#fff',
  padding: '10px 25px',
  border: 'none',
  alignItems: 'flex-start',
  borderRadius: '25px',
  fontSize: '1rem',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
},

askSection: {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginTop: '30px',
  marginBottom: '40px'
},

sectionTitle: {
  fontSize: '1.5rem',
  fontWeight: '600',
  marginBottom: '10px',
  color: '#134075'
},


buttonContainer: {
  display: 'flex',
  width: '100%',
  marginTop: '10px',
  display: 'flex',
  justifyContent: 'flex-start', // align left
},



container: {
  width: '100%',                      // ✅ fix typo
                 // ✅ fix case
  padding: '40px',
  background: 'linear-gradient(to right, rgba(223, 226, 238, 0.19), rgb(255, 255, 255))',
  color: '#134075',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  position: 'relative',
},


  heroOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    zIndex: 1
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    color: '#134075'
  },
  heroTitle: {
    fontFamily: 'Placebo FM',
    fontSize: '50px',
    fontWeight: 700,
    lineHeight: '96px',
    marginBottom: '10px'
  },
  heroSubtitle: {
    fontFamily: 'Placebo FM',
    fontSize: '24px',
    fontWeight: 300,
    lineHeight: '43.2px',
    color: 'rgba(43, 58, 103, 0.50)',
    marginBottom: '5px'
  },
  heroCaption: {
    fontFamily: 'Roboto',
    fontSize: '12px',
    fontWeight: 300,
    lineHeight: '21px',
    color: '#2B3A67'
  },
  appName: {
    position: 'absolute',
    top: '20px',
    left: '30px',
    display: 'flex',
    width: '274px',
    height: '37px',
    padding: '0px 85px',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#2B3A67',
    fontFamily: 'Placebo FM',
    fontSize: '36px',
    fontWeight: 700,
    lineHeight: '43.2px',
    zIndex: 3
  },
  welcome: {
    fontSize: '1.5rem',
    fontWeight: 800,
    marginBottom: '10px'
  },
  hello: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  loading: {
    fontSize: '1rem',
    fontStyle: 'italic',
    opacity: 0.8
  },
  dateText: {
    fontSize: '1.2rem',
    marginTop: '10px',
    marginBottom: '20px'
  },
  statsContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  card: {
    backgroundColor: 'rgba(39, 125, 159, 0.1)',
    padding: '15px 25px',
    borderRadius: '15px',
    height:'80%',
    fontSize: '1.1rem',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    minWidth: '180px'
  },
  heroBlurEdges: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  background: 'radial-gradient(ellipse at center, transparent 40%, rgba(255,255,255,0.6) 100%)',
  pointerEvents: 'none' // makes sure it doesn't block clicks
},

  
};

export default Home_test;
