import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "@/app/routes/ProtectedRoutes";
import Unauthorized from "@/pages/Unauthorized";

import AdminDashboard from "@/pages/AdminDashboard";
import AdminMerchandise from "@/pages/AdminMerchandise";
import AdminReservation from "@/pages/AdminReservations";
import AdminRestockSchedule from "@/pages/AdminRestockSchedule";
import AdminLocalShops from "@/pages/AdminLocalShops";

import Homepage from "@/pages/Homepage";
import MerchandiseDetails from "@/pages/MerchandiseDetails";
import Reservation from "@/pages/Reservation";
import LocalShop from "@/pages/LocalShop";

import Login from "@/pages/Login";
import ResetPassword from "@/pages/ResetPassword";

function AppRoutes() {
  return (
    <Routes>
      {/* Default URL */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Student routes */}
      <Route
        path="/store"
        element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <Homepage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchandise-details/:id"
        element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <MerchandiseDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reservation"
        element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <Reservation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/local-shop"
        element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <LocalShop />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchandise"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminMerchandise />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reservations"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminReservation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/restock-schedules"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminRestockSchedule />
          </ProtectedRoute>
        }
      />

      <Route
        path="/local-shops"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLocalShops />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />

      <Route
        path="/unauthorized"
        element={
          <ProtectedRoute>
            <Unauthorized />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
