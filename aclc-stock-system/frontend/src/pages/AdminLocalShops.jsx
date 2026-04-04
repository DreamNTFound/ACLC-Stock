import { useState, useEffect, useRef } from "react";
import {
  getLocalShop,
  addLocalShop,
  updateLocalShop,
  deleteLocalShop,
} from "../services/localShopService";
//import { getItems } from "../services/merchandiseService";
import { categoryOptions } from "../utils/formatHelpers";
import Modal from "../components/common/Modal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { seedLocalShop } from "../services/seedData";
import Skeleton from "@mui/material/Skeleton";

export default function LocalShops() {
  const menuRef = useRef(null);
  const [mode, setMode] = useState("add");
  const [shops, setShops] = useState([]);
  //const [items, setItems] = useState([]);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isDelShopModalOpen, setIsDelShopModalOpen] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // for context menu
  const [openMenuId, setOpenMenuId] = useState(null); // for context menu
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedLocalShop();
    const fetchShops = async () => {
      try {
        const response = await getLocalShop();
        setTimeout(() => {
          setShops(response);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching local shops:", error);
      }
    };
    fetchShops();

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

  const getInitialShopData = {
    name: "",
    address: "",
    contact: "",
    mapLink: "",
    avail_items: [],
    partner: false,
    active: true,
  };
  const [shopForm, setShopForm] = useState(getInitialShopData);
  const resetShopForm = () => setShopForm(getInitialShopData);

  const handleAddShop = () => {
    setMode("add");
    setSelectedShopId(null);
    setIsShopModalOpen(true);
  };

  const handleEditShop = (id) => {
    const shopToEdit = shops.find((shop) => shop.id === id);
    if (!shopToEdit) return;
    setMode("edit");
    setOpenMenuId(null);
    setSelectedShopId(id);
    setShopForm({
      ...getInitialShopData,
      ...shopToEdit,
    });
    setIsShopModalOpen(true);
  };

  const handleDeleteShop = async (id) => {
    setSelectedShopId(id);
    setIsDelShopModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmDeleteShop = async () => {
    if (!selectedShopId) return;
    try {
      await deleteLocalShop(selectedShopId);
      setShops((prev) => prev.filter((shop) => shop.id !== selectedShopId));
      setTimeout(() => {
        setIsDelShopModalOpen(false);
        setSelectedShopId(null);
        resetShopForm();
      }, 1000);
    } catch (error) {
      console.error("Error deleting shop:", error);
    }
  };

  const saveShop = async (e) => {
    e.preventDefault();
    try {
      if (mode === "edit") {
        const updatedShop = await updateLocalShop(selectedShopId, shopForm);
        setShops((prev) =>
          prev.map((shop) => (shop.id === selectedShopId ? updatedShop : shop)),
        );
      } else {
        const newShop = await addLocalShop(shopForm);
        setShops((prev) => [...prev, newShop]);
      }
      setTimeout(() => {
        setIsShopModalOpen(false);
        resetShopForm();
      }, 1000);
    } catch (error) {
      console.error("Error saving shop:", error);
    }
  };

  const getShopItemsPrev = (shop) => {
    const shopItems = shop.avail_items;
    const displayItems = shopItems.slice(0, 2);
    const remainingCount = shopItems.length - displayItems.length;

    return remainingCount > 0
      ? [...displayItems, `+${remainingCount} more`]
      : displayItems;
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#1e3a5f]">
                    Local Shops
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Manage recommended local shops for students
                  </p>
                </div>
                <button
                  onClick={handleAddShop}
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

                  <span>Add Shop</span>
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
                              Shop Name
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Address
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Contact
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Items
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Partner
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
                            : shops.map((shop) => (
                                <tr
                                  key={shop.id}
                                  className="opacity-0 animate-fadeIn"
                                >
                                  <td className="p-2 align-middle">
                                    {shop.name}
                                  </td>
                                  <td className="p-2 align-middle">
                                    {shop.address}
                                  </td>
                                  <td className="p-2 align-middle">
                                    {shop.contact}
                                  </td>
                                  <td className="p-2 align-middle">
                                    <div className="flex flex-wrap gap-1">
                                      {getShopItemsPrev(shop).map((item, i) => (
                                        <div
                                          key={i}
                                          className="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors border-transparent bg-slate-100 text-secondary-foreground text-[10px]"
                                        >
                                          {item}
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-2 align-middle">
                                    {shop.partner && (
                                      <span className="text-yellow-400 text-xl">
                                        ★
                                      </span>
                                    )}
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
                                          prevId === shop.id ? null : shop.id,
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
              onClick={() => handleEditShop(openMenuId)}
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
              onClick={() => handleDeleteShop(openMenuId)}
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
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
        title={mode === "edit" ? "Edit Local Shop" : "Add Local Shop"}
        children={
          <>
            <div className="space-y-4 py-2">
              <div>
                <label className="text-sm font-medium leading-none">
                  Shop Name *
                </label>
                <input
                  type="text"
                  value={shopForm.name}
                  onChange={(e) =>
                    setShopForm({ ...shopForm, name: e.target.value })
                  }
                  className="inline-flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium leading-none">
                  Address *
                </label>
                <input
                  type="text"
                  value={shopForm.address}
                  onChange={(e) =>
                    setShopForm({ ...shopForm, address: e.target.value })
                  }
                  className="inline-flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium leading-none">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={shopForm.contact}
                  onChange={(e) =>
                    setShopForm({ ...shopForm, contact: e.target.value })
                  }
                  className="inline-flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium leading-none">
                  Google Maps Link
                </label>
                <input
                  type="text"
                  placeholder="https://maps.google.com/?q=..."
                  value={shopForm.mapLink}
                  onChange={(e) =>
                    setShopForm({ ...shopForm, mapLink: e.target.value })
                  }
                  className="inline-flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium leading-none">
                  Available Items
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categoryOptions.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={shopForm.avail_items.includes(category)}
                        onChange={(e) =>
                          setShopForm({
                            ...shopForm,
                            avail_items: e.target.checked
                              ? [...shopForm.avail_items, category]
                              : shopForm.avail_items.filter(
                                  (item) => item !== category,
                                ),
                          })
                        }
                        className="w-4 h-4 shrink-0 rounded border-primary shadow transition duration-200 checked:bg-primary focus:ring-0"
                      />
                      <span className="text-sm">{category}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none">
                  Official Partner Shop
                </label>
                <button
                  onClick={() =>
                    setShopForm((prev) => ({ ...prev, partner: !prev.partner }))
                  }
                  className={`inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 ${
                    shopForm.partner ? "bg-emerald-500" : "bg-slate-900"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      shopForm.partner ? "translate-x-4" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium text-xs text-slate-500">
                  Active (visible to students)
                </label>
                <button
                  onClick={() =>
                    setShopForm((prev) => ({ ...prev, active: !prev.active }))
                  }
                  className={`inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 ${
                    shopForm.active ? "bg-emerald-500" : "bg-slate-900"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      shopForm.active ? "translate-x-4" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 py-4 border-t border-slate-200 mt-4">
                <button
                  onClick={() => {
                    setIsShopModalOpen(false);
                    resetShopForm();
                  }}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 px-4 py-2 rounded-md cursor-pointer"
                >
                  <span>Cancel</span>
                </button>
                <button
                  onClick={saveShop}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md cursor-pointer"
                >
                  <span>Save</span>
                </button>
              </div>
            </div>
          </>
        }
      />

      {/* Delete Product Modal */}
      <Modal
        isOpen={isDelShopModalOpen}
        onClose={() => setIsDelShopModalOpen(false)}
        title="Delete Product"
        children={
          <>
            <h1 className="text-slate-500">
              Are you sure you want to delete this product?
            </h1>
            <div className="flex items-center justify-end gap-3 pt-4 py-4">
              <button
                type="button"
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 px-4 py-2 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteShop}
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
