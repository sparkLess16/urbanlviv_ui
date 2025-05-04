import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Layout.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="logo" onClick={() => navigate("/")}>
          UrbanLviv
        </h1>
        <div className="header-buttons">
          {isAuthenticated ? (
            <button className="sign-out-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/signup")}>Sign Up</button>
            </>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
