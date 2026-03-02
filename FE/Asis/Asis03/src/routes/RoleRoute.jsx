import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function RoleRoute({ allow = [] }) {
  const { user } = useAuth();
  const role = user?.role; // "STAFF" | "CUSTOMER"
  if (!role) return <Navigate to="/login" replace />;
  if (allow.length > 0 && !allow.includes(role))
    return <Navigate to="/" replace />;
  return <Outlet />;
}
