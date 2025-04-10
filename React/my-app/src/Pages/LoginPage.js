import React, { useState } from "react";

function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Logging in with:\nEmail: ${loginEmail}\nPassword: ${loginPassword}`);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    alert(`Signing up with:\nName: ${signupName}\nEmail: ${signupEmail}\nPassword: ${signupPassword}`);
  };

  const wrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "320px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#6c63ff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const switchTextStyle = {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px",
  };

  const toggleLinkStyle = {
    color: "#6c63ff",
    cursor: "pointer",
    fontWeight: "bold",
    marginLeft: "5px",
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
          {isSignup ? "Sign Up" : "Log In"}
        </h2>

        {!isSignup ? (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" style={buttonStyle}>Log In</button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" style={buttonStyle}>Sign Up</button>
          </form>
        )}

        <div style={switchTextStyle}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span
            onClick={() => setIsSignup(!isSignup)}
            style={toggleLinkStyle}
          >
            {isSignup ? "Log In" : "Sign Up"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
