import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import "./register.css";
import { toast } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";

function Register({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [cPassword, setcPassword] = useState("");

  const navigate = useNavigate();
  const collectionRef = collection(db, "users");
  const handleLogin = async (e) => {
    e.preventDefault();

    if (password === cPassword) {
      try {
        await createUserWithEmailAndPassword(auth, email, password).then(
          (res) => {
            setDisplayName(res.data);
            toast.success("Registration successful now you can login");
            addDoc(collectionRef, { displayName: displayName });
            navigate("/login");
          }
        );
      } catch (error) {
        toast.error(error.code);
      }
    } else {
      toast.error("password mismatch");
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="form-container">
          <form className="form-reg" onSubmit={handleLogin}>
            <div className="title">
              <h3>Sign Up</h3>
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
                type="text"
                placeholder="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="ConfirmPassword"
                value={cPassword}
                onChange={(e) => setcPassword(e.target.value)}
                required
              />
              <button type="submit">Login to your account</button>
            </div>
            <span>
              Already have an account? <Link to="/login">Login</Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
