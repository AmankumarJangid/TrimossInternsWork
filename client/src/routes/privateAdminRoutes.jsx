// src/routes/PrivateAdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateAdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateAdminRoute;
