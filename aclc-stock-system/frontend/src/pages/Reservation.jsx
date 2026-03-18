import { useState, useEffect } from "react";
import { getReservations } from "../services/reservationService";
import { seedReservations } from "../services/seedData";
import { reserveStatusOptions } from "../utils/formatHelpers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Reservation() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    seedReservations();
    const fetchReservations = async () => {
      try {
        const reservationData = await getReservations();
        setTimeout(() => {
          setReservations(reservationData);
        }, 500);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };
    fetchReservations();
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <nav className="bg-[#1e3a5f] text-white sticky top-0 z-50 shadow-lg">
          <Navbar />
        </nav>
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">
                  My Reservations
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Track your merchandise reservation requests
                </p>
              </div>
              <div className="space-y-3">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="rounded-xl border bg-card text-card-foreground shadow hover:shadow-md transition-shadow opacity-0 animate-fadeIn"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="font-semibold text-[#1e3a5f] text-lg">
                            {reservation.itemName}
                          </div>
                          <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-slate-500">
                            {reservation.size && (
                              <span>Size: {reservation.size}</span>
                            )}
                            <span>Qty: {reservation.quantity}</span>
                            <span>
                              Created:{" "}
                              {new Date(
                                reservation.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            GCash Ref: {reservation.gcashRef || "N/A"}
                          </p>
                        </div>
                        <div
                          className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-semibold transition-color border-transparent shadow border text-sm ${
                            reservation.status === "Confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : reservation.status === "Fulfilled"
                                ? "bg-emerald-100 text-emerald-800"
                                : reservation.status === "Cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {reservation.status === "Pending" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 mr-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          )}
                          {reservation.status === "Confirmed" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 mr-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          )}
                          {reservation.status === "Fulfilled" && (
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
                              className="lucide lucide-package-icon lucide-package w-4 h-4 mr-2"
                            >
                              <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                              <path d="M12 22V12" />
                              <polyline points="3.29 7 12 12 20.71 7" />
                              <path d="m7.5 4.27 9 5.15" />
                            </svg>
                          )}
                          {reservation.status === "Cancelled" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 mr-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          )}
                          {reservation.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-8">
          <Footer />
        </footer>
      </div>
    </>
  );
}
