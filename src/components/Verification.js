import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const UserVerification = () => {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Function to extract token from query parameters
  const getTokenFromQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("token");
  };

  useEffect(() => {
    const token = getTokenFromQuery();
    if (token) {
      // Make the API call to verify the account with the token
      axios
        .get(`http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/auth/verify-account?token=${token}`)
        .then((response) => {
          // You can customize this message based on your API response
          setMessage("Verification Successful! You can now log in.");
        })
        .catch((error) => {
          setMessage("Verification failed. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setMessage("No verification token provided.");
      setLoading(false);
    }
  }, [location.search]);

  return (
    <div>
      <h1>Verification</h1>
      {loading ? <p>Loading...</p> : <p>{message}</p>}
    </div>
  );
};

export default UserVerification;
