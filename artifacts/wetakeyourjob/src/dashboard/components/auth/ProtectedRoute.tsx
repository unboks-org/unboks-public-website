import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/dashboard/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
