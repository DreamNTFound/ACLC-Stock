import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useUser } from "@/hooks/setUser";
import Swal from "sweetalert2";
import Modal from "@/components/common/Modal";

export default function Login() {
  const navigate = useNavigate();
  const { reloadUser } = useUser();
  const [usn, setUsn] = useState(authService.getRememberMe() || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginErrorType, setLoginErrorType] = useState("");
  const [rememberMe, setRememberMe] = useState(!!authService.getRememberMe());
  const [resetPassword, setResetPassword] = useState(false);
  const [forgotUsn, setForgotUsn] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    usn: "",
    password: "",
  });

  // Function to handle password reset
  const handleForgotPassword = () => {
    setForgotUsn(usn);
    setResetPassword(true);
  };

  const handleSendResetLink = async () => {
    if (!forgotUsn.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Student ID Required",
        text: "Please enter your Student ID to reset your password.",
      });
      return;
    }

    try {
      setForgotLoading(true);
      await authService.forgotPassword(forgotUsn);
      setResetPassword(false);
      Swal.fire({
        icon: "success",
        title: "Reset link sent",
        text: "If an account exists with that Student ID, password reset instructions have been sent to the associated email.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to send reset link",
        text:
          error.message ||
          "An error occurred while trying to send the reset link.",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLogin = async () => {
    if (loginLoading) return;

    // Validate each field separately.
    const errors = {
      usn: !usn.trim() ? "Username is required." : "",
      password: !password ? "Password is required." : "",
    };

    setFieldErrors(errors);
    setLoginError("");
    setLoginErrorType("");

    if (errors.usn || errors.password) {
      return;
    }

    try {
      setLoginLoading(true);

      const users = await authService.login(usn.trim(), password);

      if (!users?.role) {
        throw new Error("Unable to determine your account role.");
      }

      const currentUser = await reloadUser();

      if (!currentUser) {
        throw new Error(
          "Login succeeded, but we couldn't load your account information. Please try again.",
        );
      }

      if (rememberMe) {
        authService.setRememberMe(usn.trim());
      } else {
        authService.clearRememberMe();
      }

      let destination;
      let accountType;

      if (users.role === "admin") {
        destination = "/admin-dashboard";
        accountType = "Administrator";
      } else if (users.role === "student") {
        destination = "/store";
        accountType = "Student";
      } else {
        throw new Error("Your account does not have access to this system.");
      }

      // Keep your existing success alert.
      await Swal.fire({
        icon: "success",
        title: `${accountType} Login Successful!`,
        text: `Welcome! You have successfully logged in as a ${accountType.toLowerCase()}.`,
        confirmButtonText: "Continue",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      navigate(destination, { replace: true });
    } catch (error) {
      if (!navigator.onLine) {
        setLoginErrorType("network");
        setLoginError(
          "Your internet connection appears to be offline. Check your connection and try again.",
        );
      } else if (error.code === "NETWORK_ERROR" || error.status === 503) {
        setLoginErrorType(error.status === 503 ? "service" : "network");
        setLoginError(
          error.status === 503
            ? "We couldn't connect to the system right now. Please try again in a moment."
            : "We couldn't reach the server. Check your connection or try again shortly.",
        );
      } else {
        setLoginErrorType("general");
        setLoginError(error.message || "Unable to sign in. Please try again.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    const handleOffline = () => {
      setLoginError(
        "You're connection is offline. Check your internet connection.",
      );
    };

    const handleOnline = () => {
      setLoginError("");
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // const handleLogin = async () => {
  //   if (loginLoading) return;

  //   if (!usn.trim() || !password) {
  //     setLoginError("Please enter both Student ID and password.");
  //     return;
  //   }

  //   try {
  //     setLoginLoading(true);
  //     setLoginError("");

  //     const users = await authService.login(usn, password);
  //     const currentUser = await reloadUser();

  //     if (!currentUser) {
  //       throw new Error("Unable to load your account information.");
  //     }

  //     if (rememberMe) {
  //       authService.setRememberMe(usn);
  //     } else {
  //       authService.clearRememberMe();
  //     }

  //     if (users.role === "admin") {
  //       navigate("/admin-dashboard");
  //     } else if (users.role === "student") {
  //       navigate("/store");
  //     } else {
  //       throw new Error("Your account does not have access to this system.");
  //     }
  //   } catch (error) {
  //     setLoginError(error.message || "Invalid Student ID or password");
  //     Swal.fire({
  //       icon: "error",
  //       title: "Login Failed",
  //       text: error.message || "Invalid Student ID or password",
  //     });
  //   } finally {
  //     setLoginLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const user = authService.getCurrentUser();
  //   if (user?.role === "admin") {
  //     navigate("/admin-dashboard");
  //   } else if (user?.role === "student") {
  //     navigate("/store");
  //   }
  // });

  // Function to handle login
  // const handleLogin = async () => {
  //   try {
  //     setLoginError("");
  //     setLoginLoading(true);
  //     Swal.fire({
  //       title: "Logging in...",
  //       allowOutsideClick: false,
  //       didOpen: () => {
  //         Swal.showLoading();
  //       },
  //     });

  //     const users = await authService.login(usn, password);
  //     await reloadUser();

  //     if (rememberMe) {
  //       authService.setRememberMe(usn);
  //     } else {
  //       authService.clearRememberMe();
  //     }

  //     await Swal.fire({
  //       icon: "success",
  //       title: "Login successful",
  //       text: "Welcome!",
  //       confirmButtonText: "Continue",
  //       timer: 1500,
  //     });

  //     if (users.role === "admin") {
  //       //console.log("Admin logged in:", user);
  //       navigate("/admin-dashboard");
  //     } else if (users.role === "student") {
  //       //console.log("Student logged in:", user);
  //       navigate("/store");
  //     }
  //   } catch (error) {
  //     Swal.close();
  //     setLoginError(error.message || "Invalid USN or password");
  //     Swal.fire({
  //       icon: "error",
  //       title: "Login Failed",
  //       text: error.message || "Invalid USN or password",
  //     });
  //   }
  // };

  // useEffect(() => {
  //   const user = authService.getCurrentUser();
  //   if (user?.role === "admin") {
  //     navigate("/admin-dashboard");
  //   } else if (user?.role === "student") {
  //     navigate("/store");
  //   } else {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] via-[#2a4d7a] to-[#1e3a5f] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="rounded-xl border text-card-foreground w-full max-w-md relative z-10 shadow-2xl border-none backdrop-blur-sm bg-white/95">
          <div className="flex flex-col space-y-1.5 p-6 text-center pb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a5f] to-[#2a4d7a] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-105 transition-transform">
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
                className="lucide lucide-package w-10 h-10 text-[#d4a843]"
              >
                <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
                <path d="M12 22V12"></path>
                <polyline points="3.29 7 12 12 20.71 7"></polyline>
                <path d="m7.5 4.27 9 5.15"></path>
              </svg>
            </div>
            <div className="tracking-tight text-3xl font-bold text-[#1e3a5f]">
              <span>Welcome Back</span>
            </div>
            <div className="text-slate-500 mt-2 text-base">
              <span>ACLC College of Tacloban</span>
              <p className="text-sm">Merchandise Management System</p>
            </div>
          </div>
          <div className="p-6 pt-0 space-y-6 px-8 pb-8">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm leading-none text-slate-700 font-medium">
                  Student ID
                </label>
                <div className="relative group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Enter your USN"
                    value={usn}
                    onFocus={() => {
                      setFieldErrors((prev) => ({
                        ...prev,
                        usn: "",
                      }));
                      setLoginError("");
                    }}
                    onChange={(e) => {
                      setUsn(e.target.value);
                      setLoginError("");
                      setFieldErrors((prev) => ({ ...prev, usn: "" }));
                    }}
                    aria-invalid={Boolean(fieldErrors.usn || loginError)}
                    className={`flex w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm pl-11 h-12 ${
                      fieldErrors.usn || loginError
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 focus:border-[#1e3a5f]"
                    }`}
                  />
                </div>
                {fieldErrors.usn && (
                  <p className="mt-1 text-sm text-red-500" role="alert">
                    {fieldErrors.usn}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm leading-none text-slate-700 font-medium">
                    Password
                  </label>
                  <button
                    onClick={handleForgotPassword}
                    className="text-xs text-[#d4a843] hover:text-[#c49a3a] font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onFocus={() => {
                      setFieldErrors((prev) => ({
                        ...prev,
                        password: "",
                      }));
                      setLoginError("");
                    }}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError("");
                      setFieldErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    className={`flex w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm pl-11 h-12
                      ${
                        fieldErrors.password || loginError
                          ? "border-red-500 focus:border-red-500"
                          : "border-slate-200 focus:border-[#1e3a5f]"
                      }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
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
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    ) : (
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
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-500" role="alert">
                  {fieldErrors.password}
                </p>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#1e3a5f]"
                />
                <label className="text-sm text-slate-600 cursor-pointer">
                  Remember me on this device
                </label>
              </div>

              {loginError && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={`mt-4 rounded-xl border p-4 ${
                    loginErrorType === "general"
                      ? "border-red-200 bg-red-50 text-red-800"
                      : "border-amber-200 bg-amber-50 text-amber-900"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        loginErrorType === "general"
                          ? "bg-red-100"
                          : "bg-amber-100"
                      }`}
                    >
                      {loginErrorType === "network" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 10-2.2M8.5 15.5a5 5 0 0 1 3-1" />
                          <path d="m3 3 18 18" />
                        </svg>
                      ) : loginErrorType === "general" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 8v4m0 4h.01" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <rect x="3" y="4" width="18" height="13" rx="2" />
                          <path d="M8 21h8m-4-4v4M8 9h8m-8 4h5" />
                        </svg>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold">
                        {loginErrorType === "network"
                          ? "Connection problem"
                          : loginErrorType === "service"
                            ? "System temporarily unavailable"
                            : "Unable to sign in"}
                      </h3>

                      <p className="mt-1 text-sm leading-5">{loginError}</p>

                      {loginErrorType !== "general" && (
                        <>
                          <button
                            type="button"
                            onClick={handleLogin}
                            disabled={loginLoading}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg
                            bg-[#214574] px-4 py-2 text-sm font-semibold text-white
                            transition hover:bg-[#19375c]
                            disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`h-4 w-4 ${
                                loginLoading ? "animate-spin" : ""
                              }`}
                              aria-hidden="true"
                            >
                              <path d="M20 7v5h-5M4 17v-5h5" />
                              <path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3" />
                            </svg>

                            {loginLoading
                              ? "Connecting..."
                              : "Retry Connection"}
                          </button>

                          <p className="mt-2 text-xs opacity-80">
                            If the problem continues, please try again later.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleLogin}
                disabled={loginLoading}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm hover:bg-primary/90 px-4 py-2 w-full h-12 bg-gradient-to-r from-[#1e3a5f] to-[#2a4d7a] hover:from-[#2a4d7a] hover:to-[#1e3a5f] text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
              >
                {loginLoading ? "Signing in..." : "Sign In to Portal"}
              </button>
            </div>
            <div className="text-center space-y-3">
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Having trouble signing in? Contact the registrar's office or
                  email support@aclc.edu.ph
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-600">
                  Demo credentials: admin / admin123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={resetPassword}
        onClose={() => setResetPassword(false)}
        title="Forgot Password"
      >
        <div className="space-y-5 py-4">
          <div>
            <p className="text-sm text-slate-500 mb-5">
              Enter your Student ID and we'll send password reset instructions
              to the email associated with your account.
            </p>

            <label className="text-sm leading-none text-slate-700 font-medium">
              Student ID
            </label>

            <div className="relative mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118 a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>

              <input
                type="text"
                placeholder="Enter your USN"
                value={forgotUsn}
                onChange={(e) => setForgotUsn(e.target.value)}
                className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-base shadow-sm md:text-sm pl-11 h-12 focus:border-[#1e3a5f] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendResetLink}
            disabled={forgotLoading}
            className="inline-flex items-center justify-center rounded-md text-sm px-4 py-2 w-full h-12 bg-gradient-to-r from-[#1e3a5f] to-[#2a4d7a] hover:from-[#2a4d7a] hover:to-[#1e3a5f] text-white font-semibold shadow-lg transition-all disabled:opacity-50"
          >
            {forgotLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>
      </Modal>
    </>
  );
}
