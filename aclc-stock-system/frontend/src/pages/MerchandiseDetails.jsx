import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getItems } from "../services/merchandiseService";
import { getRecommendedShops } from "../services/localShopService";
import { formatCurrency } from "../utils/formatCurrency";
import { authService } from "../services/authService";
import { addReservation } from "../services/reservationService";
import { payWithGCash } from "../services/paymentService";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../components/common/Modal";

export default function MerchandiseDetails() {
  const { id } = useParams();
  const user = authService.getCurrentUser();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [notes, setNotes] = useState("");
  const [recommendedShops, setRecommendedShops] = useState(null);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [reserveModalStep, setReserveModalStep] = useState(1);
  const [gcashNumber, setGcashNumber] = useState("");
  const [paymentError, setPaymentError] = useState(null);
  const [openSelect, setOpenSelect] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemData = await getItems();
        const itemDetails = itemData.find(
          (item) => item.id === id || item.id === Number(id),
        );
        setItem(itemDetails || null);
        if (itemDetails) {
          const recommendedShop = await getRecommendedShops(
            itemDetails.category,
          );
          setRecommendedShops(recommendedShop);
          //console.log("Recommended Shops:", recommendedShop);
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };
    fetchItem();
  }, [id]);

  const handleReserveClick = () => {
    setReserveModalOpen(true);
    setOpenSelect(false);
  };

  const handlePayment = async () => {
    const phoneRegex = /^09[0-9]{9}$/;
    if (!phoneRegex.test(gcashNumber)) {
      setPaymentError("Please enter a valid GCash number.");
      return;
    }
    setPaymentError(null);

    try {
      Swal.fire({
        title: "Processing Payment",
        html: `
      <p>Please check your GCash app and confirm the payment request</p>
      <div style="margin-top:10px;">
        <span class="swal2-loader"></span>
        <p style="font-size:14px;margin-top:8px;">Waiting for confirmation...</p>
      </div>
    `,
        allowOutsideClick: false,
        showConfirmButton: false,
        width: "420px",
        padding: "1.5rem",
        customClass: {
          popup: "mx-4 rounded-xl",
        },
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const paymentResult = await payWithGCash({
        userId: user.id,
        amount: item.price * quantity,
        gcashNumber,
      });
      if (!paymentResult.success) {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: paymentResult.error,
        });
        return;
      }

      await addReservation({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        itemName: item.name,
        size: selectedSize,
        quantity,
        notes,
        status: "Pending",
        paymentMethod: "GCash",
        gcashRef: paymentResult.transactionId,
      });
      Swal.fire({
        icon: "success",
        title: "Reservation Submitted!",
        text: "You'll be notified when the item is ready for pickup.",
        confirmButtonText: "Close",
      });
      setReserveModalOpen(false);
      setReserveModalStep(1);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred during payment. Please try again.",
      });
      console.log(error);
    }
  };

  const getTotalStock = (item) => {
    if (item.sizes && item.sizes.length > 0) {
      return item.sizes.reduce((total, s) => total + Number(s.stock), 0);
    }
    return Number(item.stock || 0);
  };

  const getStockStatus = (item) => {
    const totalStock = getTotalStock(item);
    if (totalStock === 0) return "Out of Stock";
    if (totalStock <= 5) return "Low Stock";
    if (totalStock > 5) return "In Stock";
    return item.stock;
  };

  if (!item) return null;

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
              <NavLink
                to="/"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#1e3a5f] transition-colors"
              >
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
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
                <span>Back to Merchandise</span>
              </NavLink>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
                  {item?.images?.[0] ? (
                    <img
                      src={item.images?.[0]}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
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
                      className="lucide lucide-package-icon lucide-package w-40 h-40 text-slate-400"
                    >
                      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                      <path d="M12 22V12" />
                      <polyline points="3.29 7 12 12 20.71 7" />
                      <path d="m7.5 4.27 9 5.15" />
                    </svg>
                  )}
                </div>
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-medium text-[#d4a843] uppercase tracking-wider mb-1">
                      {item.category}
                    </p>
                    <h1 className="text-3xl font-bold text-[#1e3a5f] mb-3">
                      {item.name}
                    </h1>
                    <div
                      className={`inline-flex items-center rounded-md font-semibold transition-colors border text-sm px-3 py-1 ${
                        getStockStatus(item) === "Out of Stock"
                          ? "bg-red-100 text-red-800"
                          : getStockStatus(item) === "Low Stock"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {getStockStatus(item)}
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#1e3a5f]">
                    {formatCurrency(item.price)}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                  <div>
                    {item.sizes && item.sizes.length > 0 ? (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-2">
                          Available Sizes
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {item.sizes.map((size) => (
                            <div
                              key={size.size}
                              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                size.stock === 0
                                  ? " border-slate-200 bg-white text-slate-700"
                                  : ""
                              }`}
                            >
                              {size.size} ({size.stock})
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-slate-500">
                          Total Stock: {getTotalStock(item)}
                        </p>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleReserveClick}
                    disabled={getTotalStock(item) === 0}
                    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors shadow py-2 w-full sm:w-auto bg-[#d4a843] hover:bg-[#c49a3a] text-[#1e3a5f] font-semibold h-12 px-8 text-base ${
                      getTotalStock(item) === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#d4a843] hover:bg-[#c49a3a] text-[#1e3a5f] cursor-pointer"
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
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                      />
                    </svg>
                    <span>Reserve This item</span>
                  </button>
                </div>
              </div>
              {item &&
                getTotalStock(item) === 0 &&
                recommendedShops &&
                recommendedShops.length > 0 && (
                  <div className="rounded-xl border bg-card text-card-foreground shadow opacity-0 animate-fadeIn">
                    <div className="flex flex-col space-y-1.5 p-6 pb-3">
                      <div className="font-semibold tracking-tight text-lg text-[#1e3a5f] flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-[#d4a843]"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                          />
                        </svg>
                        <span>Recommended Local Shops</span>
                      </div>
                      <p className="text-sm text-slate-500">
                        This item is currently out of stock. You may find
                        similar items at there nearby shops:
                      </p>
                    </div>
                    <div className="p-6 pt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {recommendedShops.map((shop) => (
                          <div
                            key={shop.id}
                            className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200"
                          >
                            <div className="p-5">
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-[#1e3a5f] text-lg">
                                      {shop.name}
                                    </h3>
                                    {shop.partner && (
                                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors shadow hover:bg-primary/80 bg-[#d4a843]/15 text-[#d4a843] border-[#d4a843]/30 text-[10px]">
                                        <span className="text-yellow-400 text-xs">
                                          ★ Partner
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-start gap-2 text-sm text-slate-500">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-4 h-4 mt-0.5"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                      />
                                    </svg>
                                    <span>{shop.address}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-4 h-4 "
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                                  />
                                </svg>
                                <span>{shop.contact}</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {shop.avail_items.map((item, i) => (
                                  <div
                                    key={i}
                                    className="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors border-transparent bg-slate-100 text-secondary-foreground text-[10px]"
                                  >
                                    {item}
                                  </div>
                                ))}
                              </div>
                              <a
                                href={shop.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors border bg-background shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs w-full text-[#1e3a5f] border-[#1e3a5f]/20 hover:bg-[#1e3a5f]/5 mt-2"
                              >
                                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors border bg-background shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs w-full text-[#1e3a5f] border-[#1e3a5f]/20 hover:bg-[#1e3a5f]/5">
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
                                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                    />
                                  </svg>

                                  <span>View on Map</span>
                                </button>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-8">
          <Footer />
        </footer>
      </div>

      <Modal
        isOpen={reserveModalOpen}
        overlayClassName={
          reserveModalStep === 2
            ? "bg-black/80 backdrop-blur-sm"
            : "bg-black/50 backdrop-blur-sm"
        }
        onClose={() => {
          setReserveModalOpen(false);
          setReserveModalStep(1);
          setPaymentError(null);
          setGcashNumber("");
        }}
        title={
          reserveModalStep === 1 ? `Reserve: ${item.name}` : "GCash Payment"
        }
        children={
          reserveModalStep === 1 ? (
            <>
              <div className="space-y-4 py-2">
                <div>
                  <label className="text-sm font-medium leading-none">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={user.name || ""}
                    className="inline-flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-sm font-medium leading-none">
                    USN
                  </label>
                  <input
                    type="text"
                    value={user.usn || ""}
                    className="inline-flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm cursor-not-allowed"
                    readOnly
                  />
                </div>
                {item.sizes && item.sizes.length > 0 && (
                  <div className="relative">
                    <label className="text-sm font-medium leading-none">
                      Size
                    </label>
                    <button
                      className="inline-flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
                      onClick={() => setOpenSelect(!openSelect)}
                    >
                      {selectedSize || "Select Size"}
                    </button>
                    {openSelect && (
                      <ul className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-md">
                        {item.sizes?.map((option) => (
                          <li
                            key={option.size}
                            onClick={() => {
                              setSelectedSize(option.size);
                              setOpenSelect(false);
                            }}
                            className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                          >
                            {option.size}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium leading-none">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setQuantity(val < 1 ? 1 : val);
                    }}
                    className="inline-flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium leading-none">
                    Notes (optional)
                  </label>
                  <textarea
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests..."
                    className="inline-flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
                  />
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 py-4 border-t border-slate-200 mt-4">
                  <button
                    onClick={() => setReserveModalOpen(false)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={() => {
                      if (
                        item.sizes &&
                        item.sizes.length > 0 &&
                        !selectedSize
                      ) {
                        Swal.fire({
                          icon: "warning",
                          title: "Missing Information",
                          text: "Please select a size before reserving.",
                        });
                        return;
                      }
                      if (quantity < 1) {
                        Swal.fire({
                          icon: "warning",
                          title: "Invalid Quantity",
                          text: "Quantity must be at least 1.",
                        });
                        return;
                      }
                      setReserveModalStep(2);
                    }}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors shadow h-9 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
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
                        d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                      />
                    </svg>

                    <span>Pay with GCash</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 py-2">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium opacity-90">
                      Amount to Pay
                    </span>
                    <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors shadow hover:bg-primary/80 bg-white/20 text-white border-white/30">
                      GCash
                    </div>
                  </div>
                  <p className="text-3xl font-bold">
                    {formatCurrency(item.price * quantity)}
                  </p>
                  <p className="text-xs opacity-75 mt-1">{item.name}</p>
                </div>
                <div className="space-y-3 px-1">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Enter your GCash number
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Make sure it's registered and has sufficient balance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Confirm payment in GCash app
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        You'll receive a prompt on your phone
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Reservation confirmed
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        You'll receive a confirmation email
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    GCash Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="09XX-XXX-XXXX"
                    value={gcashNumber}
                    onChange={(e) => setGcashNumber(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm mt-1"
                  />
                  {paymentError && (
                    <p className="text-red-600 text-sm mt-1">{paymentError}</p>
                  )}
                </div>
                <div className="flex gap-2 pt-4 py-4 border-t border-slate-200 mt-4">
                  <button
                    onClick={() => {
                      setReserveModalStep(1);
                      setPaymentError(null);
                    }}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 flex-1"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    disabled={!/^09\d{9}$/.test(gcashNumber)}
                    onClick={handlePayment}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors shadow h-9 px-4 py-2 flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{formatCurrency(item.price * quantity)}</span>
                  </button>
                </div>
              </div>
            </>
          )
        }
      />
    </>
  );
}
