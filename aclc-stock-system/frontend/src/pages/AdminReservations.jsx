import { useState, useEffect, useRef } from "react";
import {
  getReservations,
  updateReservationStatus,
} from "../services/reservationService";
import { reserveStatusOptions } from "../utils/formatHelpers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Reservation() {
  const menuRef = useRef(null);
  const [reservations, setReservations] = useState([]);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // for context menu
  const [openMenuId, setOpenMenuId] = useState(null); // for context menu
  const [statusMenu, setStatusMenu] = useState("All Status");
  const [openSelectStatus, setOpenSelectStatus] = useState(false);

  useEffect(() => {
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

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuRef]);

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await updateReservationStatus(openMenuId, newStatus);
      setReservations(updated);
      //console.log("Updated reservations:", updated);
      setOpenMenuId(null);
    } catch (error) {
      console.error("Error updating reservations status:", error);
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    if (statusMenu && statusMenu !== "All Status") {
      return reservation.status === statusMenu;
    }
    return true;
  });

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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#1e3a5f]">
                    Reservations
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Manage student reservation requests
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenSelectStatus(!openSelectStatus)}
                    className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input px-3 py-2 text-sm shadow-sm ring-offset-background w-full sm:w-44 bg-white"
                  >
                    <span>{statusMenu}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>
                  {openSelectStatus && (
                    <ul className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-md">
                      <li
                        onClick={() => {
                          setStatusMenu("All Status");
                          setOpenSelectStatus(false);
                        }}
                        className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                      >
                        All Status
                      </li>

                      {reserveStatusOptions.map((option) => (
                        <li
                          key={option}
                          onClick={() => {
                            setStatusMenu(option);
                            setOpenSelectStatus(false);
                          }}
                          className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-0">
                  <div className="overflow-x-auto">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-slate-50">
                            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                              Student
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                              Item
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                              Size
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                              Qty
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                              Date
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                              Status
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-12"></th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {filteredReservations.map((reservation) => (
                            <tr key={reservation.id}>
                              <td className="p-2 align-middle">
                                <div className="font-medium text-[#1e3a5f] text-sm">
                                  <p className="font-medium text-[#1e3a5f] text-sm">
                                    {reservation.userName || "N/A"}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {reservation.userEmail || "N/A"}
                                  </p>
                                </div>
                              </td>
                              <td className="p-2 align-middle">
                                <div className="font-medium text-[#1e3a5f] text-sm">
                                  {reservation.itemName || "N/A"}
                                </div>
                              </td>
                              <td className="p-2 align-middle">
                                <div className="font-medium text-[#1e3a5f] text-sm">
                                  {reservation.size || "-"}
                                </div>
                              </td>
                              <td className="p-2 align-middle">
                                <div className="font-medium text-[#1e3a5f] text-sm">
                                  {reservation.quantity}
                                </div>
                              </td>
                              <td className="p-2 align-middle">
                                <div className="font-medium text-[#1e3a5f] text-sm">
                                  {new Date(
                                    reservation.created_at,
                                  ).toLocaleDateString() || "N/A"}
                                </div>
                              </td>
                              <td className="p-2 align-middle">
                                <div
                                  className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-semibold transition-color border-transparent shadow border text-xs ${
                                    reservation.status === "Confirmed"
                                      ? "bg-blue-100 text-blue-800"
                                      : reservation.status === "Fulfilled"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : reservation.status === "Cancelled"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {reservation.status}
                                </div>
                              </td>
                              <td className="p-2 align-middle">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const rect =
                                      e.currentTarget.getBoundingClientRect();
                                    const menuWidth = 160;
                                    setMenuPosition({
                                      top: rect.bottom + 6,
                                      left: rect.right - menuWidth,
                                    });
                                    setOpenMenuId((prevId) =>
                                      prevId === reservation.id
                                        ? null
                                        : reservation.id,
                                    );
                                  }}
                                  className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors duration-200 ease-in-out"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6 text-slate-500"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-8">
          <Footer />
        </footer>
      </div>

      {openMenuId && (
        <>
          <div
            ref={menuRef}
            style={{ top: menuPosition.top, left: menuPosition.left }}
            className="absolute right-10 w-40 rounded-md border border-slate-200 bg-transparent bg-white shadow-lg z-50"
          >
            <button
              onClick={() => handleStatusChange("Confirmed")}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 bg-white border-b border-slate-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-blue-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>

              <span className="text-sm">Confirm</span>
            </button>
            <button
              onClick={() => handleStatusChange("Fulfilled")}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 bg-white border-b border-slate-200"
            >
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
                className="lucide lucide-package-icon lucide-package text-green-600 w-4 h-4"
              >
                <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                <path d="M12 22V12" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <path d="m7.5 4.27 9 5.15" />
              </svg>
              <span className="text-sm">Mark Fulfilled</span>
            </button>
            <button
              onClick={() => handleStatusChange("Cancelled")}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 bg-white border-b border-slate-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>

              <span className="text-red-500 text-sm">Cancel</span>
            </button>
          </div>
        </>
      )}
    </>
  );
}
