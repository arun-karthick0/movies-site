import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import "./login.css";
import { toast } from "react-toastify";

function Login({ setUser, user }) {
  console.log(user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then((res) => {
          setUser(res.user.email);
          console.log(res);
          window.localStorage.setItem("email", res.user.email);
          toast.success("Login successful");
          navigate("/");
        })
        .catch((err) => toast.error(err.code));
    } catch (error) {
      toast.error(error.code);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="form-container">
          <form className="form" onSubmit={handleLogin}>
            <div className="title">
              <h3>Login</h3>
            </div>
            <div className="form_container">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login to your account</button>
            </div>
            <span>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </span>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <p>Test-email:arun@gmail.com</p>
              <p style={{ marginTop: "10px" }}>password:123456</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
