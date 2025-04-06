import React from "react";
import "../styles/Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      // Запит до ендпоінту логіну. Токен автоматично записується у cookies.
      const loginResponse = await axios.post(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/auth/token",
        {
          grant_type: "password",
          email,
          password,
        },
        { withCredentials: true }
      );

      console.log(loginResponse.status)
      if (loginResponse.status === 200) {
        // Після успішного логіну виконуємо запит для отримання даних користувача.
        const identityResponse = await axios.post(
          "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/auth/identity",
          { withCredentials: true }
        );
        
        // Зберігаємо дані користувача (за потреби – можна використати інший метод зберігання).
        localStorage.setItem("userInfo", JSON.stringify(identityResponse.data));

        // Переадресовуємо користувача на сторінку особистого кабінету.
        navigate("/userAccount");
      } else {
        alert("Unexpected response status: " + loginResponse.status);
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="addUser">
      <h3>Sign in</h3>
      <form className="addUserForm" onSubmit={handleLogin}>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            placeholder="Enter your Email"
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            placeholder="Enter your Password"
          />
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
      <div className="login">
        <p>Don't have an account?</p>
        <Link to="/" className="btn btn-success">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
