import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL_Login = "http://localhost:8000/api/users/Login"; 
const BASE_URL_SignUp = "http://localhost:8000/api/users/SignUp";
const BASE_URL_NEWPASS = "http://localhost:8000/api/users/newpass";

function LoginPage() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState(""); 
  const [signupPassword, setSignupPassword] = useState("");
  const [signupId, setSignupId] = useState("");
  const [signupDepartment, setSignupDepartment] = useState("");
  const [DepartmentList, setDepartments] = useState([]);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotId,setforgotId] = useState("");
  const [newpassword,setnewpassword] = useState("");
  const [confirmpass,setconfirmpass] = useState("");
  //const [signupType, setSignupType] = useState("");

  useEffect(() => { //fetching departments
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(BASE_URL_SignUp); 
        setDepartments(res.data);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };
    fetchDepartments();
  }, []);

 const handleForgotPassword = async  (e) => {
  e.preventDefault();

  try {
    console.log("Sending reset request to:", forgotEmail);
    console.log("id:", forgotId);
    console.log("newpass:", newpassword);
    console.log("confirm:", confirmpass);

    const res = await axios.post(BASE_URL_NEWPASS, {
      email: forgotEmail,
      id: forgotId,
      newPassword: newpassword,     // 👈 must match Django key: newPassword
      confirmpass: confirmpass
    });

    alert(res.data.message);
    setShowForgotPassword(false);  // 👈 fix: use function call, not assignment
  } catch (err) {
    if (err.response?.data?.error) {
      alert(`❌ ${err.response.data.error}`);
    } else {
      alert("❌ Unexpected error occurred.");
    }
    console.error(err);
  }
};

  const handleLogin = async (e) => { //part that will handle login
    e.preventDefault();
    try {
      const res = await axios.post( BASE_URL_Login, {
        email: loginEmail,
        password: loginPassword,
      });
      
      localStorage.setItem("user_id", res.data.user_id) //user id token

      alert(res.data.message);

      window.location.href = "/home" //relode page to home
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err.message || "Login failed";
      alert(errorMsg);
    }
  };

  const handleSignup = async (e) => { //part that will handle signup
    e.preventDefault();
    try {
      const res = await axios.post( BASE_URL_SignUp, { //the post commend will send to the view
        _id: parseInt(signupId),
        email: signupEmail,
        name: signupName,
        password: signupPassword,
        type: "Student",
        department: signupDepartment,
        status: "Active",
        sum_points: 0,
        average: 0
      });
      alert(res.data.message);
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err.message || "Sign up failed";
      alert(errorMsg);
    }
  };

  return (
    <>
      <style>{`
                .wrapper {
              --input-focus: #2d8cf0;
              --font-color: #323232;
              --font-color-sub: #666;
              --bg-color: #fff;
              --bg-color-alt: #666;
              --main-color: #323232;
          }

          .switch {
              transform: translateY(-200px);
              
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: 30px;
              width: 50px;
              height: 20px;
          }

          body{
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 400px;
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(115deg, #56d8e4 10%, #9f01ea 90%);
          }

          .card-side::before {
              position: absolute;
              content: 'Log in';
              left: -70px;
              top: 0;
              width: 100px;
              text-decoration: underline;
              color: var(--font-color);
              font-weight: 600;
          }

          .card-side::after {
              position: absolute;
              content: 'Sign up';
              left: 70px;
              top: 0;
              width: 100px;
              text-decoration: none;
              color: var(--font-color);
              font-weight: 600;
          }

          .toggle {
              opacity: 0;
              width: 0;
              height: 0;
          }

          .slider {
              box-sizing: border-box;
              border-radius: 5px;
              border: 2px solid var(--main-color);
              box-shadow: 4px 4px var(--main-color);
              position: absolute;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: var(--bg-color);
              transition: 0.3s;
          }

          .slider:before {
              box-sizing: border-box;
              position: absolute;
              content: "";
              height: 20px;
              width: 20px;
              border: 2px solid var(--main-color);
              border-radius: 5px;
              left: -2px;
              bottom: 2px;
              background-color: var(--bg-color);
              box-shadow: 0 3px 0 var(--main-color);
              transition: 0.3s;
          }

          .toggle:checked + .slider {
              background-color: var(--input-focus);
          }

          .toggle:checked + .slider:before {
              transform: translateX(30px);
          }

          .toggle:checked ~ .card-side:before {
              text-decoration: none;
          }

          .toggle:checked ~ .card-side:after {
              text-decoration: underline;
          }

          .flip-card__inner {
              width: 300px;
              height: 350px;
              position: relative;
              background-color: transparent;
              perspective: 1000px;
              text-align: center;
              transition: transform 0.8s;
              transform-style: preserve-3d;
          }

          .toggle:checked ~ .flip-card__inner {
              transform: rotateY(180deg);
          }

          .toggle:checked ~ .flip-card__front {
              box-shadow: none;
          }

          .flip-card__front,
          .flip-card__back {
              padding: 20px;
              position: absolute;
              display: flex;
              flex-direction: column;
              justify-content: center;
              -webkit-backface-visibility: hidden;
              backface-visibility: hidden;
              background: lightgrey;
              gap: 20px;
              border-radius: 5px;
              border: 2px solid var(--main-color);
              box-shadow: 4px 4px var(--main-color);
          }

          .flip-card__back {
              width: 100%;
              transform: rotateY(180deg);
          }

          .flip-card__form {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
          }

          .title {
              margin: 20px 0;
              font-size: 25px;
              font-weight: 900;
              text-align: center;
              color: var(--main-color);
          }

          .flip-card__input {
              width: 250px;
              height: 40px;
              border-radius: 5px;
              border: 2px solid var(--main-color);
              background-color: var(--bg-color);
              box-shadow: 4px 4px var(--main-color);
              font-size: 15px;
              font-weight: 600;
              color: var(--font-color);
              padding: 5px 10px;
              outline: none;
          }

          .flip-card__input::placeholder {
              color: var(--font-color-sub);
              opacity: 0.8;
          }

          .flip-card__input:focus {
              border: 2px solid var(--input-focus);
          }

          .flip-card__btn:active,
          .button-confirm:active {
              box-shadow: 0px 0px var(--main-color);
              transform: translate(3px, 3px);
          }

          .flip-card__btn {
              margin: 10px 0;
              width: 120px;
              height: 40px;
              border-radius: 5px;
              border: 2px solid var(--main-color);
              background-color: var(--bg-color);
              box-shadow: 4px 4px var(--main-color);
              font-size: 17px;
              font-weight: 600;
              color: var(--font-color);
              cursor: pointer;
          }
      `}</style>

      <div className="wrapper">
        <div className="card-switch">
          <label className="switch">
            <input type="checkbox" className="toggle" />
            <span className="slider"></span>
            <span className="card-side"></span>

            <div className="flip-card__inner">
              <div className="flip-card__front">
                <div className="title">{showForgotPassword ? "Reset Password" : "Log in"}</div>
                
                {!showForgotPassword ? (
                <form className="flip-card__form" onSubmit={handleLogin}>
                  <input
                    className="flip-card__input"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="flip-card__link"
                    
                    onClick={(e) => {
                    e.preventDefault();         // 👈 prevents checkbox toggle
                    setShowForgotPassword(true);
                  }}
                    style={{ background: "none", border: "none", color: "#007BFF", cursor: "pointer", marginTop: "10px" }}
                  >
                    Forgot Password?
                  </button>
                  <button className="flip-card__btn" type="submit">
                    Let's go!
                  </button>
                </form>
                ): (
                  <form className="flip-card__form" onSubmit={handleForgotPassword}>
                <input
                  className="flip-card__input"
                  name="forgotEmail"
                  placeholder="Enter your email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                 <input
                  className="flip-card__input"
                  name="forgotId"
                  placeholder="Enter your Id"
                  type="id"
                  value={forgotId}
                  onChange={(e) => setforgotId(e.target.value)}
                  required
                />
                 <input
                  className="flip-card__input"
                  name="newpass"
                  placeholder="Enter new Password"
                  type="password"
                  value={newpassword}
                  onChange={(e) => setnewpassword(e.target.value)}
                  required
                />
                <input
                  className="flip-card__input"
                  name=" confirm newpass"
                  placeholder="Confirm new Password"
                  type="password"
                  value={confirmpass}
                  onChange={(e) => setconfirmpass(e.target.value)}
                  required
                />
                <button className="flip-card__btn" type="submit">
                  Confirm
                </button>
                <button
                  type="button"
                  className="flip-card__link"
                  
                 onClick={(e) => {
                    e.preventDefault();       
                    setShowForgotPassword(false);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#007BFF",
                    cursor: "pointer",
                    marginTop: "0.25px"
                  }}
                >Back to Login
                </button>
              </form>
                )}
            </div>

              <div className="flip-card__back">
                <div className="title">Sign up</div>
                <form className="flip-card__form" onSubmit={handleSignup}>
                  <input
                    className="flip-card__input"
                    placeholder="Name"
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                  <input
                    className="flip-card__input"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />                  
                  <input
                  className="flip-card__input"
                  name="Id"
                  placeholder="Id Number"
                  type="text"
                  value={signupId}
                  onChange={(e) => setSignupId(e.target.value)}
                  required
                  />
                  <select
                    className="flip-card__input"
                    name="Department"
                    value={signupDepartment}
                    onChange={(e) => setSignupDepartment(e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {DepartmentList.map((dept, idx) => (
                      <option key={idx} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <button className="flip-card__btn" type="submit">
                    Confirm!
                  </button>
                </form>
              </div>
            </div>
          </label>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
