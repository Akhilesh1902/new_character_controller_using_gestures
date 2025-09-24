import React, { useState } from "react";
import axios from "axios";

const formStyle = {
  maxWidth: "400px",
  margin: "50px auto",
  padding: "30px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  borderRadius: "8px",
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#fff",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0 16px 0",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "16px",
  boxSizing: "border-box",
  color: "#021c38ff",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#007BFF",
  border: "none",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  cursor: "pointer",
};

const messageStyle = {
  marginTop: "10px",
  fontSize: "14px",
  color: "red",
  textAlign: "center",
};

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        username,
        password,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={formStyle}>
      <h2 style={{ textAlign: "center" }}>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          style={inputStyle}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          style={inputStyle}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          style={buttonStyle}
          type="submit">
          Register
        </button>
      </form>
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

export default SignUp;
