import { useState, useEffect } from "react";
import { reservationService } from "@/services/reservationService";
//import { seedReservations } from "@/services/seedData";
import { useUser } from "@/hooks/setUser";
import { Hash, ShoppingBag, Calendar, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Skeleton from "@mui/material/Skeleton";

export default function Reservation() {
  const { user } = useUser();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    //seedReservations();
    if (!user?._id) return;
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);

        const reservationData = await reservationService.getMyReservation(
          user._id,
        );

        const sortedReservations = reservationData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        setReservations(sortedReservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setReservations([]);
        setError("Failed to fetch reservations.");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [user?._id]);

  // For future implementation of canceling reservation by user
  const handleCancelReservation = async (reservationId) => {
    try {
      await reservationService.cancelReservation(reservationId);
      // Update the reservations state to remove the canceled reservation
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation._id === reservationId
            ? { ...reservation, status: "Cancelled" }
            : reservation,
        ),
      );
    } catch (error) {
      console.error("Error canceling reservation:", error);
    }
  };

  console.log(reservations);

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
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border bg-card text-card-foreground shadow hover:shadow-md transition-shadow opacity-0 animate-fadeIn"
                    >
                      <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        height={100}
                      />
                    </div>
                  ))
                ) : error ? (
                  <p className="text-red-500">Error: {error}</p>
                ) : reservations.length > 0 ? (
                  reservations.map((reservation) => (
                    <div
                      key={reservation._id}
                      className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-5">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                          {/* Left: Reservation Information */}
                          <div className="min-w-0 flex-1">
                            {/* Product name */}
                            <div>
                              <h2 className="text-lg font-semibold text-[#1e3a5f] truncate">
                                {reservation.productId?.item_name || "N/A"}
                              </h2>

                              <p className="text-xs text-slate-400 mt-1">
                                Reservation #{reservation._id}
                              </p>
                            </div>

                            {/* Reservation details */}
                            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4 text-sm">
                              {/* Size */}
                              <div className="grid grid-cols-[auto_1fr] gap-x-1.5">
                                <Hash className="h-3 w-3 mt-0.5 text-slate-400" />
                                <span className="text-xs text-slate-400">
                                  Size
                                </span>

                                <span />
                                <span className="text-sm text-slate-700 font-medium">
                                  {reservation.size || "N/A"}
                                </span>
                              </div>

                              {/* Quantity */}
                              <div className="grid grid-cols-[auto_1fr] gap-x-1.5">
                                <ShoppingBag className="h-3 w-3 mt-0.5 text-slate-400" />
                                <span className="text-xs text-slate-400">
                                  Quantity
                                </span>

                                <span />
                                <span className="text-sm text-slate-700 font-medium">
                                  {reservation.quantity || "N/A"}
                                </span>
                              </div>

                              {/* Created */}
                              <div className="grid grid-cols-[auto_1fr] gap-x-1.5">
                                <Calendar className="h-3 w-3 mt-0.5 text-slate-400" />
                                <span className="text-xs text-slate-400">
                                  Created
                                </span>

                                <span />
                                <span className="text-sm text-slate-700 font-medium">
                                  {new Date(
                                    reservation.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {/* Payment */}
                            <div className="mt-4 pt-4 border-t border-slate-100">
                              <div className="grid grid-cols-[auto_1fr] gap-x-1.5">
                                <FileText className="h-3 w-3 mt-0.5 text-slate-400" />

                                <span className="text-xs text-slate-400">
                                  Payment method
                                </span>

                                <span />

                                <p className="text-sm text-slate-700 font-medium mt-0.5">
                                  {reservation.paymentMethod === "Cash"
                                    ? "Cash on Pickup"
                                    : reservation.gcashRef
                                      ? `GCash • Ref: ${reservation.gcashRef}`
                                      : "Not specified"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Right: Status + Action */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 sm:min-w-[150px]">
                            {/* Status */}
                            <div
                              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border ${
                                reservation.status === "Ready for Pickup"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : reservation.status === "Claimed"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : reservation.status === "Cancelled"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {reservation.status === "Pending" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.8}
                                  stroke="currentColor"
                                  className="w-3.5 h-3.5 mr-1.5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v6h4.5"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                  />
                                </svg>
                              )}

                              {reservation.status === "Ready for Pickup" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.8}
                                  stroke="currentColor"
                                  className="w-3.5 h-3.5 mr-1.5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m9 12.75 2.25 2.25L15 9.75"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                  />
                                </svg>
                              )}

                              {reservation.status === "Claimed" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.8}
                                  stroke="currentColor"
                                  className="w-3.5 h-3.5 mr-1.5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M20 7.5 12 3 4 7.5m16 0v9L12 21l-8-4.5v-9"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 12v9m-8-13.5 8 4.5 8-4.5"
                                  />
                                </svg>
                              )}

                              {reservation.status === "Cancelled" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.8}
                                  stroke="currentColor"
                                  className="w-3.5 h-3.5 mr-1.5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1-18 0Z"
                                  />
                                </svg>
                              )}

                              {reservation.status}
                            </div>

                            {/* Cancel action */}
                            {reservation.status === "Pending" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCancelReservation(reservation._id)
                                }
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.8}
                                  stroke="currentColor"
                                  className="w-3.5 h-3.5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 7h12M9 7V5h6v2m-7 0 1 12h6l1-12"
                                  />
                                </svg>
                                Cancel reservation
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm text-slate-400 text-center mt-4">
                      No reservation found.
                    </p>
                  </div>
                )}
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
