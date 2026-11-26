import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

import { productService } from "@/services/merchandiseService";
import { recommendedShopService } from "@/services/localShopService";
import { reservationService } from "@/services/reservationService";
import { payWithGCash } from "@/services/paymentService";

import { useUser } from "@/hooks/setUser";

import GCashPayment from "@/components/payment/GCashPayment";

import { ProductImage } from "@/components/merchandise/ProductImage";
import RecommendedShops from "@/components/merchandise/RecommendedShops";
import ReservationForm from "@/components/merchandise/ReservationForm";

import {
  showGCashPaymentSuccess,
  showReservationSubmitted,
} from "@/utils/paymentAlerts";
import {
  validateReservation,
  buildReservationData,
} from "@/utils/reservationHelpers";
import { getTotalStock, getStockStatus } from "@/utils/merchandiseHelpers";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatPostedDate } from "@/utils/formatHelpers";
import { getPaymentAmount, validateGCashNumber } from "@/utils/paymentHelpers";

import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Modal from "@/components/common/Modal";

export default function MerchandiseDetails() {
  const { id } = useParams();
  const { user } = useUser();

  const [item, setItem] = useState(null);
  const [recommendedShops, setRecommendedShops] = useState(null);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [reserveModalStep, setReserveModalStep] = useState(1);
  const [gcashNumber, setGcashNumber] = useState("");
  const [paymentError, setPaymentError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [notes, setNotes] = useState("");
  const [openSelect, setOpenSelect] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const paymentAmount = getPaymentAmount({
    item,
    quantity,
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const productData = await productService.getAllProduct();
        const recommendedShop =
          await recommendedShopService.getRecommendedShop();

        const itemDetails = productData.find(
          (product) => product._id === id || product._id === Number(id),
        );

        setItem(itemDetails || null);

        if (!itemDetails) {
          setRecommendedShops([]);
          return;
        }

        const recommendShop = recommendedShop.filter((shop) =>
          shop.avail_items?.includes(itemDetails.item_category),
        );

        setRecommendedShops(recommendShop);
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

  const handleReserve = async () => {
    try {
      await reservationService.addReservation(
        buildReservationData({
          item,
          user,
          selectedSize,
          quantity,
          notes,
          paymentMethod: selectedPaymentMethod,
          paymentStatus: "Unpaid",
        }),
      );

      Swal.fire({
        icon: "success",
        title: "Reservation Submitted!",
        text: "Pay upon pickup.",
      });

      setReserveModalOpen(false);
      setReserveModalStep(1);
      resetReservationForm();
    } catch (error) {
      console.error("Error adding reservation:", error);

      Swal.fire({
        icon: "error",
        title: "Reservation Failed",
        text: "Unable to submit your reservation. Please try again.",
      });
    }
  };

  const handlePayWithGCash = async () => {
    if (!validateGCashNumber(gcashNumber)) {
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
            <p style="font-size:14px;margin-top:8px;">
              Waiting for confirmation...
            </p>
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
        userId: user._id,
        amount: paymentAmount,
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

      await reservationService.addReservation(
        buildReservationData({
          item,
          user,
          selectedSize,
          quantity,
          notes,
          paymentMethod: "GCash",
          paymentStatus: "For Verification",
          gcashRef: paymentResult.transactionId,
        }),
      );

      await showGCashPaymentSuccess({
        item,
        quantity,
        totalAmount: paymentAmount,
        transactionRef: paymentResult.transactionId,
      });

      await showReservationSubmitted();

      setReserveModalOpen(false);
      setReserveModalStep(1);
      resetReservationForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred during payment. Please try again.",
      });

      console.error(error);
    }
  };

  const handleReservationContinue = () => {
    const validationError = validateReservation({
      item,
      selectedSize,
      quantity,
      selectedPaymentMethod,
    });

    if (validationError) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: validationError,
      });
      return;
    }

    if (selectedPaymentMethod === "Cash") {
      handleReserve();
      return;
    }

    setReserveModalStep(2);
  };

  const resetReservationForm = () => {
    setQuantity(1);
    setSelectedSize("");
    setNotes("");
    setSelectedPaymentMethod(null);
    setOpenSelect(false);
    setGcashNumber("");
    setPaymentError(null);
  };

  if (!item) return null;

  // Use the actual createdAt field. Do not derive dates from the ObjectId.
  const postedDate = item.createdAt ?? null;
  const totalStock = getTotalStock(item);
  const stockStatus = getStockStatus(item);

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
                to="/store"
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
                {/* Product Image */}
                <ProductImage item={item} />

                {/* Product Details */}
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-medium text-[#d4a843] uppercase tracking-wider mb-1">
                      {item.item_category}
                    </p>

                    <h1 className="text-3xl font-bold text-[#1e3a5f] mb-3">
                      {item.item_name}
                    </h1>

                    <div
                      className={`inline-flex items-center rounded-md font-semibold transition-colors border text-sm px-3 py-1 ${
                        stockStatus === "Out of Stock"
                          ? "bg-red-100 text-red-800"
                          : stockStatus === "Low Stock"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {stockStatus}
                    </div>
                  </div>

                  <p className="text-3xl font-bold text-[#1e3a5f]">
                    {formatCurrency(item.item_price)}
                  </p>

                  <p className="text-slate-600 leading-relaxed">
                    {item.item_description}
                  </p>

                  {/* Posted Date and Total Stock */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500 mb-1">Posted Date</p>

                      <p className="font-semibold text-slate-800">
                        {postedDate ? formatPostedDate(postedDate) : "-"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500 mb-1">Total Stock</p>

                      <p className="font-semibold text-slate-800">
                        {totalStock}
                      </p>
                    </div>
                  </div>

                  {/* Available Sizes and Individual Stock */}
                  {item.item_sizes?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700 mb-2">
                        Available Sizes
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {item.item_sizes.map((size, index) => (
                          <div
                            key={size._id || `${size.item_sizes}-${index}`}
                            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium"
                          >
                            {size.item_sizes} ({size.item_stock ?? 0})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reserve Button */}
                  <button
                    onClick={handleReserveClick}
                    disabled={totalStock === 0}
                    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors shadow py-2 w-full sm:w-auto font-semibold h-12 px-8 text-base ${
                      totalStock === 0
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

              {/* Recommended Shops */}
              {totalStock === 0 && (
                <RecommendedShops shops={recommendedShops || []} />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-8">
          <Footer />
        </footer>
      </div>

      {/* Reservation / Payment Modal */}
      <Modal
        isOpen={reserveModalOpen}
        overlayClassName={
          reserveModalStep === 2
            ? "bg-black/80 backdrop-blur-sm"
            : "bg-black/50 backdrop-blur-sm"
        }
        onClose={() => {
          setReserveModalOpen(false);
          resetReservationForm();
          setReserveModalStep(1);
        }}
        title={
          reserveModalStep === 1
            ? `Reserve: ${item.item_name}`
            : "GCash Payment"
        }
        children={
          reserveModalStep === 1 ? (
            <ReservationForm
              user={user}
              item={item}
              quantity={quantity}
              setQuantity={setQuantity}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              notes={notes}
              setNotes={setNotes}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
              openSelect={openSelect}
              setOpenSelect={setOpenSelect}
              onCancel={() => {
                setReserveModalOpen(false);
                resetReservationForm();
                setReserveModalStep(1);
              }}
              onContinue={handleReservationContinue}
            />
          ) : (
            <GCashPayment
              item={item}
              quantity={quantity}
              gcashNumber={gcashNumber}
              setGcashNumber={setGcashNumber}
              paymentError={paymentError}
              onBack={() => {
                setReserveModalStep(1);
                setPaymentError(null);
              }}
              onSubmit={handlePayWithGCash}
            />
          )
        }
      />
    </>
  );
}
