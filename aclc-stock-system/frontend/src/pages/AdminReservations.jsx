import { useState, useEffect, useRef } from "react";
import { reservationService } from "@/services/reservationService";
import { reserveStatusOptions } from "@/utils/formatHelpers";
import { ArchiveIcon } from "lucide-react";
import Swal from "sweetalert2";
import Skeleton from "@mui/material/Skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Modal from "@/components/common/Modal";

export default function Reservation() {
  const menuRef = useRef(null);
  const [reservations, setReservations] = useState([]);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // for context menu
  const [openMenuId, setOpenMenuId] = useState(null); // for context menu
  const [statusMenu, setStatusMenu] = useState("All Status");
  const [openSelectStatus, setOpenSelectStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editStatus, setEditStatus] = useState("Pending");
  const [editPaymentStatus, setEditPaymentStatus] = useState("Unpaid");
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchRes, setSearchRes] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const reservationData = await reservationService.getAllReservation();

        const sortedReservations = reservationData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        setReservations(sortedReservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setReservations([]);
        setLoading(false);
      } finally {
        setLoading(false);
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

  const handleEditStatus = (id) => {
    const reservation = reservations.find((r) => r._id === id);

    if (!reservation) return;

    setSelectedReservation(reservation);
    setEditStatus(reservation.status);
    setEditPaymentStatus(reservation.paymentStatus);
    setOpenMenuId(null);
    setIsEditStatusOpen(true);
  };

  const handleUpdateReservation = async () => {
    if (!selectedReservation) return;

    try {
      setIsUpdating(true);

      const updatedReservation = await reservationService.updateReservation(
        selectedReservation._id,
        {
          status: editStatus,
          paymentStatus: editPaymentStatus,
        },
      );

      // Update the reservation immediately in the UI
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation._id === selectedReservation._id
            ? updatedReservation
            : reservation,
        ),
      );

      setIsEditStatusOpen(false);
      setSelectedReservation(null);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Reservation status has been updated.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating reservation:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Unable to update the reservation.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    // Show only the selected archive category.
    const isArchived = reservation.isArchived === true;

    if (isArchived !== showArchived) {
      return false;
    }

    // Apply the status filter.
    if (statusMenu !== "All Status" && reservation.status !== statusMenu) {
      return false;
    }

    // Apply the search filter.
    const search = searchRes.trim().toLowerCase();

    if (!search) return true;

    return (
      String(reservation.profileId?.name ?? "")
        .toLowerCase()
        .includes(search) ||
      String(reservation.productId?.item_name ?? "")
        .toLowerCase()
        .includes(search) ||
      String(reservation.gcashRef ?? "")
        .toLowerCase()
        .includes(search)
    );
  });

  // const filteredReservations = reservations.filter((reservation) => {
  //   if (searchRes) {
  //     const search = searchRes.trim().toLowerCase();

  //     return (
  //       String(reservation.profileId?.name ?? "")
  //         .toLowerCase()
  //         .includes(search) ||
  //       String(reservation.productId?.item_name ?? "")
  //         .toLowerCase()
  //         .includes(search) ||
  //       String(reservation.gcashRef ?? "")
  //         .toLowerCase()
  //         .includes(search)
  //     );
  //   }

  //   if (statusMenu && statusMenu !== "All Status") {
  //     return reservation.status === statusMenu;
  //   }

  //   return true;
  // });

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
                    className="flex h-9 items-center justify-between whitespace-nowrap rounded-md px-3 py-2 text-sm shadow-sm ring-offset-background w-full sm:w-44 border border-slate-200 bg-white hover:bg-slate-100 data-[state=open]:bg-slate-100"
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

              {/* Filter between active and archived */}
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowArchived(false)}
                  className={`relative px-1 pb-3 text-sm font-medium transition-colors ${
                    !showArchived
                      ? "text-[#1e3a5f] border-b-2 border-[#d4a843]"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Active Reservations
                </button>

                <button
                  type="button"
                  onClick={() => setShowArchived(true)}
                  className={`flex items-center px-1 pb-3 text-sm font-medium transition-colors ${
                    showArchived
                      ? "text-[#1e3a5f] border-b-2 border-[#d4a843]"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <ArchiveIcon size={16} className="mr-1" />
                  Archived Reservations
                </button>
              </div>

              <div className="relative max-w-sm flex items-center gap-2">
                <div className="relative flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchRes}
                    onChange={(e) => setSearchRes(e.target.value)}
                    className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors md:text-sm pl-10 bg-white border-slate-200"
                  />
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
                              Mode of Payment
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
                            <th
                              colSpan={2}
                              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {loading ? (
                            Array.from({ length: 8 }).map((_, idx) => (
                              <tr
                                key={idx}
                                className="border-b transition-colors animated-pulse"
                              >
                                <td
                                  colSpan={8}
                                  className="p-1 align-middle font-medium text-[#1e3a5f]"
                                >
                                  <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height={50}
                                    className="rounded-md"
                                  />
                                </td>
                              </tr>
                            ))
                          ) : filteredReservations.length > 0 ? (
                            filteredReservations.map((reservation) => (
                              <tr
                                key={reservation._id}
                                className="opacity-0 animate-fadeIn"
                              >
                                <td className="p-2 align-middle">
                                  <div className="font-medium text-[#1e3a5f] text-sm">
                                    <p className="font-medium text-[#1e3a5f] text-sm">
                                      {reservation.profileId?.name || "N/A"}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {reservation.profileId?.email || "N/A"}
                                    </p>
                                  </div>
                                </td>
                                <td className="p-2 align-middle">
                                  <div className="flex justify-between">
                                    <div className="font-medium text-[#1e3a5f] text-sm">
                                      {reservation.paymentMethod === "GCash" ? (
                                        <>
                                          <p className="text-xs text-[#1e3a5f] ">
                                            GCash
                                          </p>
                                          <p className="text-xs text-[#1e3a5f] ">
                                            Transaction Ref:{" "}
                                            <span className="underline">
                                              {reservation.gcashRef}
                                            </span>
                                          </p>
                                          <p className="text-xs text-[#1e3a5f] ">
                                            Payment Status:{" "}
                                            <span className="underline">
                                              {reservation.paymentStatus}
                                            </span>
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          <p className="text-xs text-[#1e3a5f] ">
                                            Cash
                                          </p>
                                          <p className="text-xs text-[#1e3a5f] ">
                                            Payment Status:{" "}
                                            {reservation.paymentStatus}
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="p-2 align-middle">
                                  <div className="font-medium text-[#1e3a5f] text-sm">
                                    {reservation.productId?.item_name ||
                                      "Deleted Product"}
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
                                  <div className="flex justify-between">
                                    <div
                                      className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-semibold transition-color border-transparent shadow border text-xs ${
                                        reservation.status ===
                                        "Ready for Pickup"
                                          ? "bg-blue-100 text-blue-800"
                                          : reservation.status === "Pending"
                                            ? "bg-amber-100 text-amber-800"
                                            : reservation.status === "Claimed"
                                              ? "bg-emerald-100 text-emerald-800"
                                              : reservation.status ===
                                                  "Cancelled"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-slate-100 text-slate-800"
                                      }`}
                                    >
                                      {reservation.status}
                                    </div>
                                    <div className="">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const rect =
                                            e.currentTarget.getBoundingClientRect();
                                          const menuWidth = 130;
                                          const padding = 8;

                                          let left = rect.right - menuWidth;

                                          if (
                                            left + menuWidth >
                                            window.innerWidth
                                          ) {
                                            left =
                                              window.innerWidth -
                                              menuWidth -
                                              padding;
                                          }

                                          if (left < padding) left = padding;

                                          setMenuPosition({
                                            top: rect.bottom + 6,
                                            left: rect.right - menuWidth,
                                          });
                                          setOpenMenuId((prevId) =>
                                            prevId === reservation._id
                                              ? null
                                              : reservation._id,
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
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={7}
                                className="text-center text-slate-500 py-4"
                              >
                                No Reservation Found.
                              </td>
                            </tr>
                          )}
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
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            className="fixed w-36 rounded-md border border-slate-200 bg-white shadow-lg z-50 overflow-hidden"
          >
            {(() => {
              const reservation = reservations.find(
                (r) => r._id === openMenuId,
              );

              const isLocked =
                reservation?.status === "Claimed" ||
                reservation?.status === "Cancelled";

              return (
                <button
                  disabled={isLocked}
                  onClick={() => {
                    if (!isLocked) {
                      handleEditStatus(openMenuId);
                    }
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-sm border-b border-slate-200 ${
                    isLocked
                      ? "cursor-not-allowed bg-slate-50 text-slate-400"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>

                  <span>{isLocked ? "Locked" : "Edit"}</span>
                </button>
              );
            })()}
          </div>
        </>
      )}

      <Modal
        isOpen={isEditStatusOpen}
        onClose={() => {
          if (!isUpdating) {
            setIsEditStatusOpen(false);
            setSelectedReservation(null);
          }
        }}
        title="Update Reservation"
        children={
          selectedReservation && (
            <div className="space-y-5 py-2">
              {/* Reservation Information */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Product
                    </p>

                    <p className="mt-1 text-base font-semibold text-[#1e3a5f]">
                      {selectedReservation.productId?.item_name ||
                        "Unknown Item"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Quantity
                    </p>

                    <p className="mt-1 text-base font-semibold text-slate-700">
                      {selectedReservation.quantity}
                    </p>
                  </div>
                </div>

                {selectedReservation.size && (
                  <p className="text-sm text-slate-500 mt-2">
                    Size:{" "}
                    <span className="font-medium text-slate-700">
                      {selectedReservation.size}
                    </span>
                  </p>
                )}
              </div>

              {/* Payment Information */}
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Payment Information
                    </p>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Verify the payment before marking it as paid.
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-blue-600 border border-blue-100">
                    {selectedReservation.paymentMethod}
                  </span>
                </div>

                {selectedReservation.gcashRef ? (
                  <div className="rounded-lg border border-blue-100 bg-white p-3">
                    <p className="text-xs font-medium text-slate-500">
                      GCash Transaction Reference
                    </p>

                    <p className="mt-1 break-all font-mono text-sm font-semibold text-[#1e3a5f]">
                      {selectedReservation.gcashRef}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    No GCash transaction reference.
                  </p>
                )}

                <div className="mt-3">
                  <p className="text-xs font-medium text-slate-500">
                    Current Payment Status
                  </p>

                  <span
                    className={`inline-flex mt-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      selectedReservation.paymentStatus === "Paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {selectedReservation.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Reservation Status */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Reservation Status
                </label>

                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  disabled={
                    selectedReservation.status === "Claimed" ||
                    selectedReservation.status === "Cancelled"
                  }
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="Pending">Pending</option>
                  <option value="Ready for Pickup">Ready for Pickup</option>
                  <option value="Claimed">Claimed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Payment Status
                </label>

                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>

                <p className="mt-1.5 text-xs text-slate-500">
                  For GCash payments, mark as Paid only after verifying the
                  transaction reference.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => {
                    setIsEditStatusOpen(false);
                    setSelectedReservation(null);
                  }}
                  className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-input bg-white px-4 text-sm font-medium shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleUpdateReservation}
                  className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-[#1e3a5f] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#16304f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </div>
          )
        }
      />
    </>
  );
}
