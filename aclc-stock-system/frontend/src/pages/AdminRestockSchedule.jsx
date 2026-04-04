import { useState, useEffect, useRef } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  getSched,
  addSched,
  updateSched,
  deleteSched,
} from "../services/restockService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../components/common/Modal";
import { getItems } from "../services/merchandiseService";
import { seedSchedule } from "../services/seedData"; // Temporary seed data
import Skeleton from "@mui/material/Skeleton";

export default function RestockSchedule() {
  const menuRef = useRef(null);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isDelRestockSchedModalOpen, setIsDelRestockSchedModalOpen] =
    useState(false);
  const [restockSched, setRestockSched] = useState([]);
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState("add");
  const [selectedRestockSchedId, setSelectedRestockSchedId] = useState(null);
  const [openSelectItem, setOpenSelectItem] = useState(false);
  const [openSelectStatus, setOpenSelectStatus] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // for context menu
  const [openMenuId, setOpenMenuId] = useState(null); // for context menu
  const [loading, setLoading] = useState(true);

  const options = ["Scheduled", "Delayed", "Completed", "Cancelled"];
  const statusStyles = {
    Cancelled: "bg-red-100 text-red-700",
    Delayed: "bg-yellow-100 text-yellow-700",
    Scheduled: "bg-blue-100 text-blue-700",
    Completed: "bg-emerald-100 text-emerald-700",
  };

  useEffect(() => {
    seedSchedule();
    const fetchRestockSchedule = async () => {
      const sched = await getSched();
      const items = await getItems();
      setTimeout(() => {
        setRestockSched(sched);
        setItems(items);
        setLoading(false);
      }, 500);
    };
    fetchRestockSchedule();

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

  const getRestockSchedule = {
    merchandise_item: "",
    expected_date: "",
    expected_quantity: 0,
    status: "",
    notes: "",
  };
  const [restockForm, setRestockForm] = useState(getRestockSchedule);
  const resetForm = () => {
    setRestockForm(getRestockSchedule);
  };

  const handleAddSchedule = () => {
    setMode("add");
    setSelectedRestockSchedId(null);
    setRestockForm(getRestockSchedule);
    setIsRestockModalOpen(true);
  };

  const handleEditSchedule = (id) => {
    const schedToEdit = restockSched.find((sched) => sched.id === id);
    if (!schedToEdit) return;

    setMode("edit");
    setSelectedRestockSchedId(id);
    setRestockForm(schedToEdit);
    setIsRestockModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteSched = async (id) => {
    setSelectedRestockSchedId(id);
    setIsDelRestockSchedModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmDeleteSched = async () => {
    if (!selectedRestockSchedId) return;
    try {
      await deleteSched(selectedRestockSchedId);
      setRestockSched((prev) =>
        prev.filter((sched) => sched.id !== selectedRestockSchedId),
      );
      setTimeout(() => {
        setIsDelRestockSchedModalOpen(false);
        setSelectedRestockSchedId(null);
        resetForm();
      }, 1000);
    } catch (error) {
      console.error("Error deleting restock schedule:", error);
    }
  };

  const savedRestockSchedule = async (e) => {
    e.preventDefault();
    try {
      if (mode === "edit") {
        const updatedSchedule = await updateSched(
          selectedRestockSchedId,
          restockForm,
        );
        setRestockSched((prev) =>
          prev.map((sched) =>
            sched.id === selectedRestockSchedId
              ? updatedSchedule
              : restockSched,
          ),
        );
      } else {
        const newSchedule = await addSched(restockForm);
        setRestockSched((prev) => [...prev, newSchedule]);
      }
      setTimeout(() => {
        setIsRestockModalOpen(false);
        resetForm();
      }, 1000);
    } catch (error) {
      console.error("Error saving restock schedule:", error);
    }
  };

  const handleStatusSelect = (option) => {
    setRestockForm((prev) => ({
      ...prev,
      status: option,
    }));
    setOpenSelectStatus(false);
  };

  console.log("Restock Schedule:", restockSched);

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
                    Restock Schedule
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Manage upcoming restock dates
                  </p>
                </div>
                <button
                  onClick={handleAddSchedule}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors shadow h-9 px-4 py-2 bg-[#d4a843] hover:bg-[#c49a3a] text-[#1e3a5f] font-semibold"
                >
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
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>

                  <span>Add Schedule</span>
                </button>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-0">
                  <div className="overflow-x-a">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-slate-50">
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Item
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Date
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Quantity
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Status
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Notes
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground] w-12"></th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {loading
                            ? Array.from({ length: 8 }).map((_, idx) => (
                                <tr
                                  key={idx}
                                  className="border-b transition-colors animated-pulse"
                                >
                                  <td
                                    colSpan={6}
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
                            : restockSched?.map((sched) => (
                                <tr
                                  key={sched.id}
                                  className="border-b transition-colors animate-fadeIn"
                                >
                                  <td className="p-2 align-middle font-medium text-[#1e3a5f]">
                                    <div className="flex items-center gap-3">
                                      <span className="font-medium text-[#1e3a5f]">
                                        {sched.merchandise_item?.name || ""}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-2 align-middle text-sm">
                                    {dayjs(sched.expected_date).format(
                                      "MMM D, YYYY",
                                    ) || "N/A"}
                                  </td>
                                  <td className="p-2 align-middle">
                                    {sched.expected_quantity}
                                  </td>
                                  <td className="p-2 align-middle">
                                    <div
                                      className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-semibold transition-color border-transparent shadow border text-xs ${
                                        statusStyles[sched.status] || ""
                                      }`}
                                    >
                                      {sched.status || "N/A"}
                                    </div>
                                  </td>
                                  <td className="p-2 align-middle text-sm text-slate-500 max-w-48">
                                    {sched.notes || "N/A"}
                                  </td>
                                  <td className="p-2 align-middle">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const rect =
                                          e.currentTarget.getBoundingClientRect();
                                        const menuWidth = 128;
                                        setMenuPosition({
                                          top: rect.bottom + 6,
                                          left: rect.right - menuWidth,
                                        });
                                        setOpenMenuId((prevId) =>
                                          prevId === sched.id ? null : sched.id,
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

      {/* Edit & Delete Button */}
      {openMenuId && (
        <>
          <div
            ref={menuRef}
            style={{ top: menuPosition.top, left: menuPosition.left }}
            className="absolute right-10 w-32 rounded-md border border-slate-200 bg-transparent bg-white shadow-lg z-50"
          >
            <button
              onClick={() => handleEditSchedule(openMenuId)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 bg-white border-b border-slate-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              <span className="">Edit</span>
            </button>
            <button
              onClick={() => handleDeleteSched(openMenuId)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 bg-white border-b border-slate-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              <span className="text-red-500">Delete</span>
            </button>
          </div>
        </>
      )}

      <Modal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        title="New Restock Schedule"
      >
        <div className="space-y-4 py-2">
          <div className="relative">
            <label className="text-sm font-medium leading-none">
              Merchandise Item
            </label>
            <button
              type="button"
              onClick={() => setOpenSelectItem(!openSelectItem)}
              className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input px-3 py-2 text-sm shadow-sm ring-offset-background w-full bg-white"
            >
              <span>{restockForm.merchandise_item?.name || "Select Item"}</span>
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
            {openSelectItem && (
              <ul className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-md">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                    onClick={() => {
                      setRestockForm({
                        ...restockForm,
                        merchandise_item: item,
                      });
                      setOpenSelectItem(false);
                    }}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="text-sm font-medium leading-none">
              Expected Date
            </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={
                  restockForm.expected_date
                    ? dayjs(restockForm.expected_date)
                    : null
                }
                onChange={(newValue) =>
                  setRestockForm({ ...restockForm, expected_date: newValue })
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    className:
                      "inline-flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm",
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div>
            <label className="text-sm font-medium leading-none">
              Expected Quantity
            </label>
            <input
              type="number"
              min={0}
              value={restockForm.expected_quantity}
              onChange={(e) =>
                setRestockForm({
                  ...restockForm,
                  expected_quantity: e.target.value,
                })
              }
              className="inline-flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
            />
          </div>
          <div className="relative">
            <label className="text-sm font-medium leading-none">Status</label>
            <button
              onClick={() => setOpenSelectStatus(!openSelectStatus)}
              className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input px-3 py-2 text-sm shadow-sm ring-offset-background w-full bg-white"
            >
              <span>{restockForm.status || "Select Status"}</span>
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
                {options.map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      handleStatusSelect(option);
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
          <div>
            <label className="text-sm font-medium leading">Notes</label>
            <textarea
              type="text"
              value={restockForm.notes}
              onChange={(e) =>
                setRestockForm({ ...restockForm, notes: e.target.value })
              }
              className="inline-flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 py-4 border-t border-slate-200 mt-4">
            <button
              onClick={() => setIsRestockModalOpen(false)}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 px-4 py-2 rounded-md cursor-pointer"
            >
              <span>Cancel</span>
            </button>
            <button
              onClick={savedRestockSchedule}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md cursor-pointer"
            >
              <span>Save Schedule</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Product Modal */}
      <Modal
        isOpen={isDelRestockSchedModalOpen}
        onClose={() => setIsDelRestockSchedModalOpen(false)}
        title="Delete Product"
        children={
          <>
            <h1 className="text-slate-500">
              Are you sure you want to delete this product?
            </h1>
            <div className="flex items-center justify-end gap-3 pt-4 py-4">
              <button
                type="button"
                onClick={() => setIsDelRestockSchedModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 px-4 py-2 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteSched}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Delete
              </button>
            </div>
          </>
        }
      />
    </>
  );
}
