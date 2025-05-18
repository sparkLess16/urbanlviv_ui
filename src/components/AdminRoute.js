import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const roleId = user?.data?.role_id;

  if (!token) return <Navigate to="/login" replace />;
  if (roleId !== "2") return <Navigate to="/userAccount" replace />;

  return token ? children : <Navigate to="/login" replace />;
};

export default AdminRoute;
