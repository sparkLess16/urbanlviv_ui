import React from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../styles/Login.css";
import myImage from "../assets/login.jpeg";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    const { email, password } = values;

    try {
      const loginResponse = await axios.post(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/auth/token",
        {
          grant_type: "password",
          email,
          password,
        },
        { withCredentials: true }
      );

      if (loginResponse.status === 200) {
        const token = loginResponse.data.token;
        localStorage.setItem("authToken", token);

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        await axios.post(
          "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/auth/identity",
          null,
          config
        );
        const identityResponse = await axios.post(
          "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/auth/identity",
          null,
          config
        );

        const userData = identityResponse.data;
        localStorage.setItem("user", JSON.stringify(userData));

        navigate("/userAccount");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/\d/, "Password must contain at least one number")
      .required("Password is required"),
  });

  return (
    <div className="login-container">
      <div className="login-container-img">
        <img src={myImage} alt="Description" className="image-login" />
      </div>

      <div className="login-container-content">
        <h2 className="login-container-content-title">Login</h2>
        <p className="signup-link">
          Already have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, errors }) => (
            <Form className="addUserForm">
              {errors.server && (
                <p className="error-message">{errors.server}</p>
              )}
              <div className="inputGroup">
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="error-message"
                  />
                </div>

                <button
                  type="submit"
                  className="form-group-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Login..." : "Login"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
