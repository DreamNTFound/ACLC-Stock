import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import Swal from "sweetalert2";
import Modal from "../components/common/Modal";

export default function Login() {
  const navigate = useNavigate();
  const [usn, setUsn] = useState(authService.getRememberMe() || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(!!authService.getRememberMe());
  const [resetPassword, setResetPassword] = useState(false);

  const handleForgotPassword = () => {
    setPassword("");
    setConfirmPassword("");
    setResetPassword(true);
  };

  const handleLogin = async () => {
    try {
      setLoginError("");
      Swal.fire({
        title: "Logging in...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const user = await authService.login(usn, password);

      if (rememberMe) {
        authService.setRememberMe(usn);
      } else {
        authService.clearRememberMe();
      }

      await Swal.fire({
        icon: "success",
        title: "Login successful",
        text: `Welcome, ${user.name || "User"}!`,
        confirmButtonText: "Continue",
        timer: 1500,
      });

      if (user.role === "admin") {
        //console.log("Admin logged in:", user);
        navigate("/admin-dashboard");
      } else if (user.role === "student") {
        //console.log("Student logged in:", user);
        navigate("/");
      }
    } catch (error) {
      Swal.close();
      setLoginError(error.message || "Invalid USN or password");
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid USN or password",
      });
    }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user?.role === "admin") {
      navigate("/admin-dashboard");
    } else if (user?.role === "student") {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

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
                    onChange={(e) => {
                      setUsn(e.target.value);
                      setLoginError("");
                    }}
                    className={`flex w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm pl-11 h-12 border-slate-200 ${
                      loginError
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 focus:border-[#1e3a5f]"
                    }`}
                  />
                </div>
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError("");
                    }}
                    className={`flex w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm pl-11 h-12 border-slate-200
                      ${
                        loginError
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
              <button
                type="button"
                onClick={handleLogin}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm hover:bg-primary/90 px-4 py-2 w-full h-12 bg-gradient-to-r from-[#1e3a5f] to-[#2a4d7a] hover:from-[#2a4d7a] hover:to-[#1e3a5f] text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
              >
                Sign In to Portal
              </button>
            </div>
            <div className="text-center space-y-3">
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Having trouble signing in? Contact the registrar's office or
                  email support@aclc.edu.ph
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={resetPassword}
        onClose={() => setResetPassword(false)}
        title="Change Password"
        children={
          <>
            <div className="space-y-2 py-4">
              <div className="flex items-center justify-between">
                <label className="text-sm leading-none text-slate-700 font-medium">
                  Password
                </label>
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError("");
                  }}
                  className={`flex w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm pl-11 h-12 border-slate-200
                      ${
                        loginError
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
            <div className="space-y-2 py-4">
              <div className="flex items-center justify-between">
                <label className="text-sm leading-none text-slate-700 font-medium">
                  Confirm Password
                </label>
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
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setLoginError("");
                  }}
                  className={`flex w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm pl-11 h-12 border-slate-200
                      ${
                        loginError
                          ? "border-red-500 focus:border-red-500"
                          : "border-slate-200 focus:border-[#1e3a5f]"
                      }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
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
            <div className="flex items-center justify-end gap-3 pt-4 py-4">
              <button
                type="button"
                onClick={handleLogin}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm hover:bg-primary/90 px-4 py-2 w-full h-12 bg-gradient-to-r from-[#1e3a5f] to-[#2a4d7a] hover:from-[#2a4d7a] hover:to-[#1e3a5f] text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
              >
                Reset Password
              </button>
            </div>
          </>
        }
      />
    </>
  );
}
