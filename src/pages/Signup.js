import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const URL = process.env.BASE_URL || "http://localhost:3000";

export default function Registration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleLoginClick = () => {
    navigate("/profile");
  };

  const handleSubmit = async (e) => {
    console.log("handleSubmit");

    e.preventDefault();

    if (!username || !email || !password) {
      setError("Please Fill all required fields");
      return;
    }

    try {
      const response = await axios.post(`${URL}/user/postuser`, {
        username,
        email,
        password,
      });
      console.log(response);

      if (response.data.status === 200) {
        alert("Registration successful");
        navigate("/profile");
        setUsername("");
        setEmail("");
        setPassword("");
      } else if (response.data.status === 409) {
        alert("email already exists");
      } else if (response.data.status === 400) {
        alert("use a valid email and strong password");
      } else {
        alert("error while registration");
      }
    } catch (error) {
      console.log("error in catch handler");

      setError(error);
    }
  };

  return (
    <>
      <h1 className="heading">Sign Up</h1>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <input
            className="Input"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Username"
          />
          <input
            className="Input"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
          />
          <input
            className="Input"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Use 8 digit strong password"
          />
          <button className="login-button" type="submit">
            Sign Up
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <a className="signup-link" onClick={handleLoginClick}>
            Log in
          </a>
        </p>
        {error && (
          <div className="error-message">
            {typeof error === "object" ? JSON.stringify(error) : error}
          </div>
        )}
      </div>
    </>
  );
}
