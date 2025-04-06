import React from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../styles/SignUp.css";
import myImage from '../assets/img2.jpg';

const Signup = () => {
  const navigate = useNavigate();

  // Define the validation schema with Yup
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/\d/, "Password must contain at least one number")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required")
  });

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  };

  // Handle form submission with an API call
  const handleSignUp = async (values, { setSubmitting, setErrors }) => {
    try {
      // Make the API call to the registration endpoint
      const response = await axios.post(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/auth/register",
        values
      );

      // Assuming a success status is 200 or 201, navigate to login page
      if (response.status === 201 || response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      // If there is an error from the API, set a server error in Formik
      setErrors({
        server:
          error.response?.data?.message ||
          "Sign-up failed, please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup">
      <img src={myImage} alt="Description" />
      <div className="container">
        <h2>Create an account</h2>
        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSignUp}
        >
          {({ isSubmitting, errors }) => (
            <Form className="addUserForm">
              {errors.server && <p className="error-message">{errors.server}</p>}
              <div className="inputGroup">
                <div className="form-group">
                  <label htmlFor="firstName">First Name:</label>
                  <Field
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                  />
                  <ErrorMessage name="firstName" component="p" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name:</label>
                  <Field
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                  />
                  <ErrorMessage name="lastName" component="p" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="p" className="error-message" />
                </div>


                <div className="form-group">
                  <label htmlFor="phone">Phone Number:</label>
                  <Field
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number"
                  />
                  <ErrorMessage name="phone" component="p" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                  />
                  <ErrorMessage name="password" component="p" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password:</label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage name="confirmPassword" component="p" className="error-message" />
                </div>

                <p className="terms">
                  By creating an account, you agree to our Terms of use and Privacy Policy
                </p>

                <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                  {isSubmitting ? "Signing Up..." : "Create an Account"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
