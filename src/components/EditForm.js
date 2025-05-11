import { useEffect, useState } from "react";
import "../styles/EditForm.css";
import ConfirmDialog from "./ConfirmDialog";

const EditForm = ({ onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    setFormData({
      name: storedUser.data?.first_name || "",
      surname: storedUser.data?.last_name || "",
      email: storedUser.data?.work_email || "",
      phone: storedUser.data?.phone || "",
      password: storedUser.data?.hashed_password || "",
    });
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      FirstName: formData.name,
      LastName: formData.surname,
      Email: formData.email,
      Phone: formData.phone,
      Password: formData.password,
      ConfirmPassword: formData.password,
    };

    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/auth/update",
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response:", data);
      setShowSuccessDialog(true);

      const current = JSON.parse(localStorage.getItem("user") || "{}");

      const updatedUser = {
        ...current,
        data: {
          ...current.data,
          ...data.data,
          first_name: formData.name,
          last_name: formData.surname,
          work_email: formData.email,
          phone: formData.phone,
          hashed_password: formData.password,
        },
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      // if (onUpdate) onUpdate();
      // if (onClose) onClose();
    } catch (error) {
      console.error("Update failed:", error);
      setShowErrorDialog(true);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="input-field edit-form">
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
      {showSuccessDialog && (
        <ConfirmDialog
          message={["User information successfully updated!"]}
          buttons={[
            {
              label: "Okay",
              variant: "primary",
              onClick: () => {
                setShowSuccessDialog(false);
                if (onUpdate) onUpdate();
                if (onClose) onClose();
              },
            },
          ]}
        />
      )}

      {showSuccessDialog && (
        <ConfirmDialog
          message={["User information successfully updated!"]}
          buttons={[
            {
              label: "Okay",
              variant: "primary",
              onClick: () => {
                setShowSuccessDialog(false);
                if (onUpdate) onUpdate();
                if (onClose) onClose();
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default EditForm;
