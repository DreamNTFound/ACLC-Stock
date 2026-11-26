import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/setUser";
import { authService } from "@/services/authService";
import {
  LayoutDashboard,
  Package,
  BookOpen,
  CalendarClock,
  MapPin,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Bell,
  LogOut,
} from "lucide-react";
import Swal from "sweetalert2";
import logo from "@/assets/aclc-logo.png";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [openUserMenu, setUserMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = () => {
    authService.logout();
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "Logged Out",
      showConfirmButton: false,
      timer: 1500,
      width: "200px",
      padding: "0.5rem 1rem",
      customClass: {
        popup: "text-sm font-medium rounded-md shadow-md",
      },
    }).then(() => {
      navigate("/login");
    });
  };

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Merchandise",
      path: "/merchandise",
      icon: Package,
    },
    {
      name: "Reservations",
      path: "/reservations",
      icon: BookOpen,
    },
    {
      name: "Restock Schedules",
      path: "/restock-schedules",
      icon: CalendarClock,
    },
    {
      name: "Local Shops",
      path: "/local-shops",
      icon: MapPin,
    },
  ];

  const studentLinks = [
    {
      name: "Merchandise",
      path: "/store",
      icon: ShoppingBag,
    },
    {
      name: "My Reservation",
      path: "/reservation",
      icon: BookOpen,
    },
    {
      name: "Local Shops",
      path: "/local-shop",
      icon: MapPin,
    },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="hidden md:block">
            <NavLink
              to="/store"
              className="flex items-center gap-3 flex-shrink-0"
            >
              <img
                src={logo}
                alt="ACLC Logo"
                className="w-8 h-8 object-contain rounded-full"
              />
              <div>
                <h1 className="text-lg font-bold tracking-tight">ACLC Stock</h1>
                <p className="sm:text-[10px] text-xs text-slate-300 leading-none">
                  ACLC College of Tacloban
                </p>
              </div>
            </NavLink>
          </div>
          {!mobileMenu ? (
            <button onClick={() => setMobileMenu(true)} className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          ) : (
            <button onClick={() => setMobileMenu(false)} className="md:hidden">
              <X />
            </button>
          )}
          <div className="relative w-full md:w-auto md:hidden">
            <div
              className={`md:hidden absolute top-5 -left-5 w-full bg-slate-800 text-white px-4 pt-4 pb-4 overflow-hidden transition-all duration-300 ${
                mobileMenu ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-700">
                <NavLink to="/store" className="flex items-center gap-3 mb-4">
                  <img
                    src={logo}
                    alt="ACLC Logo"
                    className="w-8 h-8 object-contain rounded-full"
                  />
                  <div>
                    <h1 className="text-lg font-bold tracking-tight">
                      ACLC Stock
                    </h1>
                    <p className="text-[10px] text-slate-300 -mt-1 leading-none">
                      ACLC College of Tacloban
                    </p>
                  </div>
                </NavLink>
              </div>
              <div className="flex flex-col gap-2">
                {user?.role === "admin" && (
                  <>
                    {adminLinks.map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenu(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            isActive ? "text-[#d4a843] bg-slate-600" : ""
                          }`
                        }
                      >
                        <link.icon className="w-5 h-5" />
                        <span>{link.name}</span>
                      </NavLink>
                    ))}
                  </>
                )}
                {user?.role === "student" && (
                  <>
                    {studentLinks.map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenu(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            isActive ? "text-[#d4a843] bg-slate-600" : ""
                          }`
                        }
                      >
                        <link.icon className="w-5 h-5" />
                        <span>{link.name}</span>
                      </NavLink>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {user?.role === "admin" && (
              <>
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive ? "text-[#d4a843] bg-slate-600" : ""
                      }`
                    }
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </>
            )}
            {user?.role === "student" && (
              <>
                {studentLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive ? "text-[#d4a843] bg-slate-600" : ""
                      }`
                    }
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </>
            )}
          </div>
          <div className="flex items-center relative">
            {user?.role === "student" && (
              <NotificationBell
                profileId={user?._id}
                className="mr-2 md:mr-4 w-8 h-8 cursor-pointer"
              />
            )}
            <button
              onClick={() => setUserMenu(!openUserMenu)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:text-accent-foreground h-9 py-2 text-white gap-2 px-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#d4a843] flex items-center justify-center text-[#1e3a5f] font-bold text-sm">
                {user?.name ? user?.name.charAt(0).toUpperCase() : "G"}
              </div>
              <span className="hidden sm:inline text-sm">
                {user?.name || "Guest"}
              </span>
              <ChevronDown className="w-5 h-5" />
            </button>
            {openUserMenu && (
              <div className="absolute right-0 top-full mt-2 min-w-40 max-w-56 w-max rounded-md bg-white shadow-lg border border-slate-200 z-50">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-slate-900 break-words">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 break-all">
                    {user?.email}
                  </p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] font-medium uppercase">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-red-600 hover:text-red-800">
                    Sign Out
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
