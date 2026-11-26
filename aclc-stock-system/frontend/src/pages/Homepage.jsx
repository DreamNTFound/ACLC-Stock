import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { productService } from "@/services/merchandiseService";
import { formatCurrency } from "@/utils/formatCurrency";
import { categoryOptions } from "@/utils/formatHelpers";
import { statusOptions } from "@/utils/formatHelpers";
import ChatAssistant from "@/components/assistant/ChatAssistant";
import Skeleton from "@mui/material/Skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNearBottom } from "@/utils/useScrollBoundary";

export default function Homepage() {
  const isNearBottom = useNearBottom(150);
  const [items, setItems] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [selectCategory, setSelectCategory] = useState("All Category");
  const [openSelectCategory, setOpenSelectCategory] = useState(false);
  const [selectStatus, setSelectStatus] = useState("All Status");
  const [openSelectStatus, setOpenSelectStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openChatAssistant, setOpenChatAssistant] = useState(false);

  const API_BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  ).replace(/\/api\/?$/, "");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await productService.getAllProduct();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
        setError("Failed to fetch items.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const getTotalStock = (item) => {
    if (item.item_sizes && item.item_sizes.length > 0) {
      return item.item_sizes.reduce(
        (total, s) => total + Number(s.item_stock),
        0,
      );
    }
    return item.item_stock;
  };

  const filteredItems = items.filter((item) => {
    if (item?.item_visible === false) return false;

    if (selectCategory && selectCategory !== "All Category") {
      if (item.item_category !== selectCategory) return false;
    }
    if (selectStatus && selectStatus !== "All Status") {
      const totalStock = getTotalStock(item);
      if (totalStock === 0 && selectStatus !== "Out of Stock") return false;
      if (totalStock > 0 && totalStock <= 5 && selectStatus !== "Low Stock")
        return false;
      if (totalStock > 5 && selectStatus !== "In Stock") return false;
    }
    if (searchItem && searchItem.trim() !== "") {
      const searchTerm = searchItem.toLowerCase();
      return (
        item.item_name.toLowerCase().includes(searchTerm) ||
        item.item_description.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  const getStockStatus = (item) => {
    const totalStock = getTotalStock(item);
    if (totalStock === 0) return "Out of Stock";
    if (totalStock <= 5) return "Low Stock";
    if (totalStock > 5) return "In Stock";
    return item.item_stock;
  };

  const chatBotHandler = () => {
    setOpenChatAssistant(!openChatAssistant);
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
              {/* Hero Section */}
              <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a4d7a] rounded-2xl p-6 sm:p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4a843]/10 rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
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
                      className="lucide lucide-shopping-bag w-5 h-5 text-[#d4a843]"
                      data-source-location="pages/Home:35:12"
                      data-dynamic-content="false"
                    >
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                      <path d="M3 6h18"></path>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <span className="text-[#d4a843] text-sm font-semibold uppercase tracking-wider">
                      SCHOOL STORE
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    ACLC School Merchandise
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base max-w-xl">
                    Browse and check availability of official ACLC College of
                    Tacloban merchandise. Reserve items or find nearby shops for
                    alternatives.
                  </p>
                </div>
              </div>
              {/* Filter Section */}
              <div className="flex flex-col sm:flex-row gap-3">
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
                    placeholder="Search merchandise..."
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors md:text-sm pl-10 bg-white border-slate-200"
                  />
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenSelectCategory(!openSelectCategory)}
                    className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input px-3 py-2 text-sm shadow-sm ring-offset-background w-full sm:w-44 bg-white"
                  >
                    <span>{selectCategory}</span>
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
                  {openSelectCategory && (
                    <ul className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-md">
                      <li
                        onClick={() => {
                          setSelectCategory("All Category");
                          setOpenSelectCategory(false);
                        }}
                        className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                      >
                        All Category
                      </li>

                      {categoryOptions.map((option) => (
                        <li
                          key={option}
                          onClick={() => {
                            setSelectCategory(option);
                            setOpenSelectCategory(false);
                          }}
                          className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenSelectStatus(!openSelectStatus)}
                    className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input px-3 py-2 text-sm shadow-sm ring-offset-background w-full sm:w-44 bg-white"
                  >
                    <span>{selectStatus}</span>
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
                          setSelectStatus("All Status");
                          setOpenSelectStatus(false);
                        }}
                        className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                      >
                        All Status
                      </li>

                      {statusOptions.map((option) => (
                        <li
                          key={option}
                          onClick={() => {
                            setSelectStatus(option);
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
              {/* Merchandise Grid Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {loading ? (
                  Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx}>
                      <div>
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={200}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="mt-4 space-y-2">
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={15}
                          className="rounded-md"
                        />
                        <div className="flex items-center justify-between">
                          <Skeleton
                            variant="rectangular"
                            width="50%"
                            height={10}
                            className="flex rounded-md"
                          />
                          <Skeleton
                            variant="rectangular"
                            width="30%"
                            height={10}
                            className="flex rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : error ? (
                  <p className="text-red-500">Error: {error}</p>
                ) : filteredItems.length > 0 ? (
                  filteredItems?.map((item) => (
                    <NavLink
                      to={`/merchandise-details/${item._id}`}
                      key={item._id}
                      className="opacity-0 animate-fadeIn"
                    >
                      <div className="rounded-xl border-bg-card text-card-foreground shadow group overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-[#d4a843]/40 cursor-pointer h-full">
                        <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                          {item?.item_images?.[0] ? (
                            <img
                              src={`${API_BASE_URL}/uploads/${item?.item_images?.[0]}`}
                              alt="Preview"
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-50"
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
                              className="lucide lucide-package-icon lucide-package w-24 h-24 text-slate-400"
                            >
                              <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                              <path d="M12 22V12" />
                              <polyline points="3.29 7 12 12 20.71 7" />
                              <path d="m7.5 4.27 9 5.15" />
                            </svg>
                          )}

                          <div
                            className={`inline-flex items-center rounded-md px-2.5 py-0.5 transition-colors shadow hover:bg-primary/80 absolute top-3 right-3 border text-xs font-medium ${
                              getStockStatus(item) === "Out of Stock"
                                ? "bg-red-100 text-red-700"
                                : getStockStatus(item) === "Low Stock"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {getStockStatus(item) === "Out of Stock" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-3 h-3 mr-1 text-red-700"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                              </svg>
                            )}
                            {getStockStatus(item) === "Low Stock" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-3 h-3 mr-1 text-amber-700"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                />
                              </svg>
                            )}
                            {getStockStatus(item) === "In Stock" && (
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
                                className="lucide lucide-package-icon lucide-package w-3 h-3 mr-1 text-emerald-700"
                              >
                                <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                                <path d="M12 22V12" />
                                <polyline points="3.29 7 12 12 20.71 7" />
                                <path d="m7.5 4.27 9 5.15" />
                              </svg>
                            )}
                            {getStockStatus(item)}
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-xs font-medium text-[#d4a843] uppercase tracking-wider mb-1">
                            {item.item_category}
                          </p>
                          <h3 className="font-semibold text-[#1e3a5f] text-lg leading-tight mb-2 group-hover:text-[#2a4d7a] transition-colors">
                            {item.item_name}
                          </h3>
                          <div className="flex items-end justify-between">
                            <p className="text-xs font-bold text-[#1e3a5f]">
                              {formatCurrency(item.item_price)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {getTotalStock(item)} in stock
                            </p>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-10">
                    <span className="text-sm text-slate-500 font-semibold">
                      No items found.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={chatBotHandler}
          className={`fixed right-6 z-50 w-14 h-14 rounded-full bg-[#1e3a5f] text-white shadow-lg hover:bg-[#2a4d7a] transition-[bottom] duration-500 ease-in-out flex items-center justify-center ${
            isNearBottom ? "bottom-24" : "bottom-6"
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
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
        </button>
        {openChatAssistant && <ChatAssistant onClose={chatBotHandler} />}

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-8">
          <Footer />
        </footer>
      </div>
    </>
  );
}
