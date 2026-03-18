import "./App.css";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMerchandise from "./pages/AdminMerchandise";
import AdminReservation from "./pages/AdminReservations";
import AdminRestockSchedule from "./pages/AdminRestockSchedule";
import AdminLocalShops from "./pages/AdminLocalShops";
import Homepage from "./pages/Homepage";
import MerchandiseDetails from "./pages/MerchandiseDetails";
import Reservation from "./pages/Reservation";
import LocalShop from "./pages/LocalShop";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Routes>
        {/* User Login */}
        <Route path="/login" element={<Login />} />

        {/* Client Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/merchandise-details/:id" element={<MerchandiseDetails />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/local-shop" element={<LocalShop />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/merchandise" element={<AdminMerchandise />} />
        <Route path="/reservations" element={<AdminReservation />} />
        <Route path="/restock-schedules" element={<AdminRestockSchedule />} />
        <Route path="/local-shops" element={<AdminLocalShops />} />
      </Routes>
    </>
  );
}

export default App;
