import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import Swal from "sweetalert2";

export default function Navbar() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
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

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) navigate("/login");
  }, [navigate]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="hidden md:block">
            <NavLink to="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 bg-[#d4a843] rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#1e3a5f]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">ACLCStock</h1>
                <p className="sm:text-[10px] text-xs text-slate-300 leading-none">
                  ACLC College of Tacloban
                </p>
              </div>
            </NavLink>
          </div>
          {!mobileMenu ? (
            <button onClick={() => setMobileMenu(true)} className="md:hidden">
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
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          ) : (
            <button onClick={() => setMobileMenu(false)} className="md:hidden">
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <div className="relative w-full md:w-auto">
            <div
              className={`md:hidden absolute top-5 -left-5 w-full bg-slate-800 text-white px-4 pt-4 pb-4 overflow-hidden transition-all duration-300 ${
                mobileMenu ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-700">
                <NavLink to="/" className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-[#d4a843] rounded-lg flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-[#1e3a5f]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold tracking-tight">
                      ACLCStock
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
                    <NavLink
                      to="/admin-dashboard"
                      onClick={() => setMobileMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive ? "text-[#d4a843] bg-slate-600" : ""
                        }`
                      }
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
                          d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                        />
                      </svg>

                      <span>Dashboard</span>
                    </NavLink>
                    <NavLink
                      to="/merchandise"
                      onClick={() => setMobileMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive ? "text-[#d4a843] bg-slate-600" : ""
                        }`
                      }
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
                          d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                        />
                      </svg>

                      <span>Merchandise</span>
                    </NavLink>
                    <NavLink
                      to="/reservations"
                      onClick={() => setMobileMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive ? "text-[#d4a843] bg-slate-600" : ""
                        }`
                      }
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
                          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                        />
                      </svg>

                      <span>Reservations</span>
                    </NavLink>
                    <NavLink
                      to="/restock-schedules"
                      onClick={() => setMobileMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive ? "text-[#d4a843] bg-slate-600" : ""
                        }`
                      }
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
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                        />
                      </svg>

                      <span>Restock Schedules</span>
                    </NavLink>
                    <NavLink
                      to="/local-shops"
                      onClick={() => setMobileMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive ? "text-[#d4a843] bg-slate-600" : ""
                        }`
                      }
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
                          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                        />
                      </svg>

                      <span>Local Shop</span>
                    </NavLink>
                  </>
                )}
                {user?.role === "student" && (
                  <>
                    <NavLink
                      to="/"
                      onClick={() => setMobileMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive ? "text-[#d4a843] bg-slate-600" : ""
                        }`
                      }
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
                          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                      </svg>

                      <span>Home</span>
                    </NavLink>
                    <NavLink
                      to="/reservation"
                      onClick={() => setMobileMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive ? "text-[#d4a843] bg-slate-600" : ""
                        }`
                      }
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
                          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                        />
                      </svg>

                      <span>Reservation</span>
                    </NavLink>
                    <NavLink
                      to="/local-shop"
                      onClick={() => setMobileMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive ? "text-[#d4a843] bg-slate-600" : ""
                        }`
                      }
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
                          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                        />
                      </svg>

                      <span>Local Shops</span>
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {user?.role === "admin" && (
              <>
                <NavLink
                  to="/admin-dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "text-[#d4a843] bg-slate-600" : ""
                    }`
                  }
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
                      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                    />
                  </svg>

                  <span>Dashboard</span>
                </NavLink>
                <NavLink
                  to="/merchandise"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "text-[#d4a843] bg-slate-600" : ""
                    }`
                  }
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
                      d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                  </svg>

                  <span>Merchandise</span>
                </NavLink>
                <NavLink
                  to="/reservations"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "text-[#d4a843] bg-slate-600" : ""
                    }`
                  }
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
                      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                    />
                  </svg>

                  <span>Reservations</span>
                </NavLink>
                <NavLink
                  to="/restock-schedules"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "text-[#d4a843] bg-slate-600" : ""
                    }`
                  }
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                    />
                  </svg>

                  <span>Restock Schedules</span>
                </NavLink>
                <NavLink
                  to="/local-shops"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "text-[#d4a843] bg-slate-600" : ""
                    }`
                  }
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
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>

                  <span>Local Shop</span>
                </NavLink>
              </>
            )}
            {user?.role === "student" && (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "text-[#d4a843] bg-slate-600" : ""
                    }`
                  }
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
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>

                  <span>Home</span>
                </NavLink>
                <NavLink
                  to="/reservation"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "text-[#d4a843] bg-slate-600" : ""
                    }`
                  }
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
                      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                    />
                  </svg>

                  <span>Reservation</span>
                </NavLink>
                <NavLink
                  to="/local-shop"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "text-[#d4a843] bg-slate-600" : ""
                    }`
                  }
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
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>

                  <span>Local Shops</span>
                </NavLink>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setUserMenu(!openUserMenu)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:text-accent-foreground h-9 py-2 text-white gap-2 px-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#d4a843] flex items-center justify-center text-[#1e3a5f] font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : "Guest"}
              </div>
              <span className="hidden sm:inline text-sm">
                {user?.name || "Guest"}
              </span>
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
            {openUserMenu && (
              <div className="absolute right-0 mt-2 top-full mt-2 w-40 rounded-md bg-white shadow-lg border border-slate-200 z-50">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] font-medium uppercase">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 inline-block mr-2 text-red-600 hover:text-red-800"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                    />
                  </svg>

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
