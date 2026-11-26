import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useUser } from "@/hooks/setUser";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useUser();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Your session has expired.",
        text: "Please log in again.",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    }
  }, [loading, user]);

  // Wait for the backend session check to finish.
  if (loading) {
    return <div className="p-6">Checking your session...</div>;
  }

  // No authenticated user: redirect to login.
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Prevent students from accessing admin pages and vice versa.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
