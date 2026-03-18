import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getItems } from "../services/merchandiseService";
import { getSched } from "../services/restockService";
import { getReservations } from "../services/reservationService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminDashboard() {
  const [totalItems, setTotalItems] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  const [pendingReservations, setPendingReservations] = useState(0);
  const [upcomingRestocks, setUpcomingRestocks] = useState(0);
  const [alertStock, setAlertStock] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const alertData = await getItems();
        const totalItemsData = await getItems();
        const totalSchedData = await getSched();
        const reservationData = await getReservations();
        setAlertStock(alertData);
        setTotalItems(totalItemsData.length);
        setOutOfStock(totalItemsData.filter((item) => item.stock === 0).length);
        setUpcomingRestocks(totalSchedData.length);
        setPendingReservations(
          reservationData.filter((res) => res.status === "Pending").length,
        );
        setRecentReservations(reservationData.slice(-5)); // Get the 5 most recent reservations
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);

  const getTotalStock = (alertStock) => {
    if (alertStock.sizes && alertStock.sizes.length > 0) {
      return alertStock.sizes.reduce((total, size) => total + size.stock, 0);
    }
    return alertStock.stock || 0;
  };

  const getStockAlert = (alertStock) => {
    const totalStock = getTotalStock(alertStock);
    return totalStock === 0
      ? "Out of Stock"
      : totalStock <= 5
        ? "Low Stock"
        : "In Stock";
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="bg-[#1e3a5f] text-white sticky top-0 z-50 shadow-lg">
          <Navbar />
        </nav>
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">
                  Admin Dashboard
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Manage your school merchandise inventory
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rounded-full opacity-10 -translate-y-8 translate-x-8" />
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-500 font-medium">
                          Total Items
                        </p>
                        <p className="text-3xl font-bold text-[#1e3a5f] mt-1">
                          {totalItems}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-blue-500 bg-opacity-15">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-blue-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 rounded-full opacity-10 -translate-y-8 translate-x-8" />
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-500 font-medium">
                          Out of Stock
                        </p>
                        <p className="text-3xl font-bold text-[#1e3a5f] mt-1">
                          {outOfStock}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-red-500 bg-opacity-15">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-red-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500 rounded-full opacity-10 -translate-y-8 translate-x-8" />
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-500 font-medium">
                          Pending Reservations
                        </p>
                        <p className="text-3xl font-bold text-[#1e3a5f] mt-1">
                          {pendingReservations}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-500 bg-opacity-15">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-amber-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 rounded-full opacity-10 -translate-y-8 translate-x-8" />
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-500 font-medium">
                          Upcoming Restocks
                        </p>
                        <p className="text-3xl font-bold text-[#1e3a5f] mt-1">
                          {upcomingRestocks}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-500 bg-opacity-15">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-emerald-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                  <div className="flex flex-col space-y-1.5 p-6 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold tracking-tight text-lg flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-amber-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                          />
                        </svg>
                        <span>Stock Alerts</span>
                      </div>
                      <NavLink
                        to="/merchandise"
                        className="text-sm text-[#d4a843] hover:underline flex items-center gap-1"
                      >
                        <span>View all</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </NavLink>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {alertStock.map((item) => {
                        const totalStock = getTotalStock(item);
                        const stockAlert = getStockAlert(item);
                        if (stockAlert === "In Stock") return null;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                          >
                            <div className="flex items-center gap-3 justify-center">
                              {item?.images?.[0] ? (
                                <img
                                  src={item?.images?.[0]}
                                  alt="Preview"
                                  className="w-8 h-8 object-cover rounded-lg"
                                />
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-package-icon lucide-package w-4 h-4 text-slate-400"
                                >
                                  <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                                  <path d="M12 22V12" />
                                  <polyline points="3.29 7 12 12 20.71 7" />
                                  <path d="m7.5 4.27 9 5.15" />
                                </svg>
                              )}

                              <span className="font-medium text-sm text-[#1e3a5f]">
                                {item.name}
                              </span>
                            </div>
                            <div
                              className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent shadow ${
                                stockAlert === "Out of Stock"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {stockAlert === "Low Stock"
                                ? `${totalStock} left`
                                : stockAlert}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                  <div className="flex flex-col space-y-1.5 p-6 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold tracking-tight text-lg flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-blue-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                          />
                        </svg>
                        <span>Recent Reservations</span>
                      </div>
                      <NavLink className="text-sm text-[#d4a843] hover:underline flex items-center gap-1">
                        <span>View all</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </NavLink>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {recentReservations
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt),
                        ) // newest first
                        .slice(0, 5) // show latest 5
                        .map((reservation) => (
                          <div
                            key={reservation.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-sm text-[#1e3a5f]">
                                {reservation.itemName}
                              </span>
                              <span className="text-xs text-slate-500">
                                {reservation.userName}
                              </span>
                            </div>
                            <div
                              className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                                reservation.status === "Pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : reservation.status === "Confirmed"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {reservation.status}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-auto">
          <Footer />
        </footer>
      </div>
    </>
  );
}
