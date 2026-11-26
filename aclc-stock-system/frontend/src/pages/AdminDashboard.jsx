import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { productService } from "@/services/merchandiseService";
import { restockScheduleService } from "@/services/restockService";
import { reservationService } from "@/services/reservationService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ActionableInsight } from "@/components/admin/dashboard/ActionableInsight";
import { ReservationChart } from "@/components/admin/dashboard/ReservationChart";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";
import { InventoryHealth } from "@/components/admin/dashboard/InventoryHealth";
import { TopItems } from "@/components/admin/dashboard/TopItems";
import Skeleton from "@mui/material/Skeleton";
import {
  Package,
  CircleX,
  BookOpen,
  CalendarClock,
  Lightbulb,
  BarChart2,
  LucideShieldCheck,
  ArrowRight,
  TriangleAlert,
  LucideTrendingUp,
} from "lucide-react";

export default function AdminDashboard() {
  const [totalItems, setTotalItems] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  const [pendingReservations, setPendingReservations] = useState(0);
  const [upcomingRestocks, setUpcomingRestocks] = useState(0);
  const [alertStock, setAlertStock] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTotalStock = (alertStock) => {
    if (alertStock.item_sizes && alertStock.item_sizes.length > 0) {
      return alertStock.item_sizes.reduce(
        (total, size) => total + size.item_stock,
        0,
      );
    }
    return alertStock.item_stock || 0;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [products, schedules, reservations] = await Promise.all([
          productService.getAllProduct(),
          restockScheduleService.getAllRestockSchedules(),
          reservationService.getAllReservation(),
        ]);
        setAlertStock(products);
        setTotalItems(products.length);
        setOutOfStock(
          products.filter((item) => getTotalStock(item) === 0).length,
        );
        setUpcomingRestocks(schedules.length);
        setPendingReservations(
          reservations.filter((res) => res.status === "Pending").length,
        );
        setRecentReservations(reservations);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStockAlert = (alertStock) => {
    const totalStock = getTotalStock(alertStock);
    return totalStock === 0
      ? "Out of Stock"
      : totalStock <= 5
        ? "Low Stock"
        : "In Stock";
  };

  const sortedAlertStock = alertStock.slice().sort((a, b) => {
    const stockA = getTotalStock(a);
    const stockB = getTotalStock(b);
    if (stockA === 0 && stockB > 0) return -1;
    if (stockA > 0 && stockB === 0) return 1;
    return stockA - stockB;
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
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">
                  Admin Dashboard
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Manage your school merchandise inventory
                </p>
              </div>
              {/* Dashboard Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rounded-full opacity-10 -translate-y-8 translate-x-8" />
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-500 font-medium">
                          Total Items
                        </p>
                        {loading ? (
                          <Skeleton
                            variant="rectangular"
                            width={50}
                            height={30}
                            className="rounded-md mt-2"
                          />
                        ) : (
                          <p className="text-3xl font-bold text-[#1e3a5f] mt-1">
                            {totalItems}
                          </p>
                        )}
                      </div>
                      <div className="p-2.5 rounded-xl bg-blue-500 bg-opacity-15">
                        <Package className="w-5 h-5 text-blue-500" />
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
                        {loading ? (
                          <Skeleton
                            variant="rectangular"
                            width={50}
                            height={30}
                            className="rounded-md mt-2"
                          />
                        ) : (
                          <p className="text-3xl font-bold text-[#1e3a5f] mt-1">
                            {outOfStock}
                          </p>
                        )}
                      </div>
                      <div className="p-2.5 rounded-xl bg-red-500 bg-opacity-15">
                        <CircleX className="w-5 h-5 text-red-500" />
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
                        {loading ? (
                          <Skeleton
                            variant="rectangular"
                            width={50}
                            height={30}
                            className="rounded-md mt-2"
                          />
                        ) : (
                          <p className="text-3xl font-bold text-[#1e3a5f] mt-1">
                            {pendingReservations}
                          </p>
                        )}
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-500 bg-opacity-15">
                        <BookOpen className="w-5 h-5 text-amber-500" />
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
                        {loading ? (
                          <Skeleton
                            variant="rectangular"
                            width={50}
                            height={30}
                            className="rounded-md mt-2"
                          />
                        ) : (
                          <p className="text-3xl font-bold text-[#1e3a5f] mt-1">
                            {upcomingRestocks}
                          </p>
                        )}
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-500 bg-opacity-15">
                        <CalendarClock className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actionable Insights */}
              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="flex flex-col space-y-1.5 p-6 pb-3">
                  <div className="font-semibold tracking-tight text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[#d4a843]" />
                    <span>Actionable Insights</span>
                  </div>
                </div>
                {loading ? (
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    className="rounded-md"
                  />
                ) : (
                  <ActionableInsight
                    alertStock={alertStock}
                    reservation={pendingReservations}
                  />
                )}
              </div>

              {/* Reservation Activity & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-3">
                <div className="lg:col-span-2">
                  <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="flex flex-col space-y-1.5 p-6 pb-3">
                      <div className="font-semibold tracking-tight text-lg flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-blue-500" />
                        <span>Reservation Activity (Last 7 Days)</span>
                      </div>
                    </div>
                    {loading ? (
                      <Skeleton
                        variant="rectangular"
                        height={200}
                        className="rounded-md"
                      />
                    ) : (
                      <ReservationChart reservations={recentReservations} />
                    )}
                  </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                  <QuickActions />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                  <div className="flex flex-col space-y-1.5 p-6 pb-3">
                    <div className="font-semibold tracking-tight text-lg flex items-center gap-2">
                      <LucideShieldCheck className="w-5 h-5 text-[#1e3a5f]" />
                      <span>Inventory Health</span>
                    </div>
                  </div>
                  {loading ? (
                    <Skeleton
                      variant="rectangular"
                      height={200}
                      className="rounded-md"
                    />
                  ) : (
                    <InventoryHealth items={alertStock} />
                  )}
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                  <div className="flex flex-col space-y-1.5 p-6 pb-3">
                    <div className="font-semibold tracking-tight text-lg flex items-center gap-2">
                      <LucideTrendingUp className="w-5 h-5 text-emerald-500" />
                      <span>Top Items</span>
                    </div>
                  </div>
                  {loading ? (
                    <Skeleton
                      variant="rectangular"
                      height={200}
                      className="rounded-md"
                    />
                  ) : (
                    <TopItems
                      reservation={recentReservations}
                      items={alertStock}
                    />
                  )}
                </div>
              </div>

              {/* Alerts & Recent Reservations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                  <div className="flex flex-col space-y-1.5 p-6 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold tracking-tight text-lg flex items-center gap-2">
                        <TriangleAlert className="w-5 h-5 text-amber-500" />
                        <span>Stock Alerts</span>
                      </div>
                      <NavLink
                        to="/merchandise"
                        className="text-sm text-[#d4a843] hover:underline flex items-center gap-1"
                      >
                        <span>View all</span>
                        <ArrowRight className="w-3 h-3" />
                      </NavLink>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {loading ? (
                        Array.from({ length: 5 }).map((_, idx) => (
                          <Skeleton
                            key={idx}
                            variant="rectangular"
                            height={50}
                          />
                        ))
                      ) : sortedAlertStock.length > 0 ? (
                        sortedAlertStock.map((item) => {
                          const totalStock = getTotalStock(item);
                          const stockAlert = getStockAlert(item);
                          if (stockAlert === "In Stock") return null;
                          return (
                            <div
                              key={item._id}
                              className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                            >
                              <div className="flex items-center gap-3 justify-center">
                                {item?.item_images?.[0] ? (
                                  <img
                                    src={`${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")}/uploads/${item?.item_images?.[0]}`}
                                    alt="Preview"
                                    className="w-8 h-8 object-cover rounded-lg"
                                  />
                                ) : (
                                  <Package className="w-8 h-8 p-1 text-slate-400" />
                                )}

                                <span className="font-medium text-sm text-[#1e3a5f]">
                                  {item?.item_name}
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
                        })
                      ) : (
                        <p className="text-sm text-slate-400 text-center py-6">
                          No stock alerts found
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                  <div className="flex flex-col space-y-1.5 p-6 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold tracking-tight text-lg flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        <span>Recent Reservations</span>
                      </div>
                      <NavLink
                        to={"/reservations"}
                        className="text-sm text-[#d4a843] hover:underline flex items-center gap-1"
                      >
                        <span>View all</span>
                        <ArrowRight className="w-3 h-3" />
                      </NavLink>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {loading ? (
                        Array.from({ length: 5 }).map((_, idx) => (
                          <Skeleton
                            key={idx}
                            variant="rectangular"
                            height={50}
                          />
                        ))
                      ) : recentReservations.length > 0 ? (
                        recentReservations
                          .slice()
                          .sort(
                            (a, b) =>
                              new Date(b.created_at) - new Date(a.created_at),
                          ) // newest first
                          .slice(0, 5) // show latest 5
                          .map((reservation) => (
                            <div
                              key={reservation._id}
                              className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium text-sm text-[#1e3a5f]">
                                  {reservation.productId?.item_name ||
                                    "Deleted Product"}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {reservation.profileId?.name ||
                                    "Unknown Student"}
                                </span>
                              </div>
                              <div
                                className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-semibold transition-color border-transparent shadow border text-xs ${
                                  reservation.status === "Confirmed"
                                    ? "bg-blue-100 text-blue-800"
                                    : reservation.status === "Ready for Pickup"
                                      ? "bg-amber-100 text-amber-800"
                                      : reservation.status === "Fulfilled"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : reservation.status === "Cancelled"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-slate-100 text-slate-800"
                                }`}
                              >
                                {reservation.status}
                              </div>
                            </div>
                          ))
                      ) : (
                        <span className="text-sm text-slate-400 text-center py-6">
                          No recent reservations
                        </span>
                      )}
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
