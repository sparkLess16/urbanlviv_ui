import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Verification.css";

const Verification = () => {
  return (
    <div className="verification-container">
      <h2 className="verification-title">Account Verified!</h2>
      <p className="description">
        Your account has been successfully verified. You can now log in.
      </p>
      <a href="/login" className="login-button">
        Go to Login
      </a>
    </div>
  );
};

export default Verification;
