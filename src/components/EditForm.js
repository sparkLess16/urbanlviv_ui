import { useState } from "react";
import "../styles/EditForm.css";

const EditForm = () => {
  const [formData, setFormData] = useState({
    name: "John",
    surname: "Doe",
    email: "john.doe@example.com",
    phone: "+123456789",
    password: "password123",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("User information saved!");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="36" height="36" rx="7" fill="white" />
            <path
              d="M18.1596 17.62C18.1296 17.62 18.1096 17.62 18.0796 17.62C18.0296 17.61 17.9596 17.61 17.8996 17.62C14.9996 17.53 12.8096 15.25 12.8096 12.44C12.8096 9.58 15.1396 7.25 17.9996 7.25C20.8596 7.25 23.1896 9.58 23.1896 12.44C23.1796 15.25 20.9796 17.53 18.1896 17.62C18.1796 17.62 18.1696 17.62 18.1596 17.62ZM17.9996 8.75C15.9696 8.75 14.3096 10.41 14.3096 12.44C14.3096 14.44 15.8696 16.05 17.8596 16.12C17.9096 16.11 18.0496 16.11 18.1796 16.12C20.1396 16.03 21.6796 14.42 21.6896 12.44C21.6896 10.41 20.0296 8.75 17.9996 8.75Z"
              fill="#292D32"
            />
            <path
              d="M18.1696 28.55C16.2096 28.55 14.2396 28.05 12.7496 27.05C11.3596 26.13 10.5996 24.87 10.5996 23.5C10.5996 22.13 11.3596 20.86 12.7496 19.93C15.7496 17.94 20.6096 17.94 23.5896 19.93C24.9696 20.85 25.7396 22.11 25.7396 23.48C25.7396 24.85 24.9796 26.12 23.5896 27.05C22.0896 28.05 20.1296 28.55 18.1696 28.55ZM13.5796 21.19C12.6196 21.83 12.0996 22.65 12.0996 23.51C12.0996 24.36 12.6296 25.18 13.5796 25.81C16.0696 27.48 20.2696 27.48 22.7596 25.81C23.7196 25.17 24.2396 24.35 24.2396 23.49C24.2396 22.64 23.7096 21.82 22.7596 21.19C20.2696 19.53 16.0696 19.53 13.5796 21.19Z"
              fill="#292D32"
            />
          </svg>
          Edit User Information
        </h2>

        <div className="input-group">
          <div className="input-field">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="surname">Surname</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <div className="input-field">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-field">
          <div className="label-with-eye">
            <label htmlFor="password">Password</label>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="eye-button"
            >
              {showPassword ? (
                // Open eye SVG

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.92 10.92 0 0 1 12 20c-7 0-11-8-11-8a21.53 21.53 0 0 1 5.17-6.58M3 3l18 18" />
                  <path d="M9.53 9.53A3.5 3.5 0 0 0 12 16a3.5 3.5 0 0 0 2.47-6.47" />
                </svg>
              ) : (
                // Closed eye SVG (eye-off)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="save-btn">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditForm;
