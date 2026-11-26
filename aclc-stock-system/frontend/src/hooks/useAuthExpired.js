import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const useAuthExpired = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    const authExpired = () => {
      if (window.location.pathname === "/login") {
        return;
      }

      if (timeoutId) return;

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Your session has expired.",
        text: "Please log in again.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      timeoutId = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    };

    window.addEventListener("auth:expired", authExpired);

    return () => {
      window.removeEventListener("auth:expired", authExpired);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigate]);
};
