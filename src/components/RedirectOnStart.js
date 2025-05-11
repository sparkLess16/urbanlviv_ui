// components/RedirectOnStart.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectOnStart = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/userAccount");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null; // нічого не рендерить
};

export default RedirectOnStart;
