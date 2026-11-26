const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const createApiError = (message, status = 0, code = "API_ERROR") => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
};

let csrfToken = null;

const getCsrfToken = async () => {
  if (csrfToken) return csrfToken;

  const response = await fetch(`${API_URL}/auth/csrf-token`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || !data.csrfToken) {
    throw new Error("Unable to initialize security token.");
  }

  csrfToken = data.csrfToken;

  return csrfToken;
};

const refreshCsrfToken = async () => {
  csrfToken = null;
  return getCsrfToken();
};

export const secureFetch = async (url, options = {}) => {
  try {
    const token = await getCsrfToken();

    const makeRequest = (csrf) =>
      fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          ...options.headers,
          "X-CSRF-Token": csrf,
        },
      });

    let response = await makeRequest(token);

    if (response.status === 403) {
      const data = await response
        .clone()
        .json()
        .catch(() => ({}));

      if (data.message?.toLowerCase().includes("security token")) {
        const newToken = await refreshCsrfToken();
        response = await makeRequest(newToken);
      }
    }

    return response;
  } catch (error) {
    if (error instanceof TypeError) {
      throw createApiError(
        "Unable to connect to the server. Please check your connection and try again.",
        0,
        "NETWORK_ERROR",
      );
    }

    throw error;
  }
};

const parseResponse = async (response) => {
  if (!response) {
    throw createApiError(
      "No response received from the server. Please try again.",
      0,
      "NETWORK_ERROR",
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw createApiError(
      data.message || "Request failed. Please try again.",
      response.status,
      response.status === 503 ? "SERVICE_UNAVAILABLE" : "HTTP_ERROR",
    );
  }

  return data;
};

export const authService = {
  login: async (usn, password) => {
    const response = await secureFetch(`${API_URL}/users/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usn, password }),
    });

    const data = await parseResponse(response);

    // No JWT is stored in localStorage.
    return data;
  },

  forgotPassword: async (usn) => {
    const response = await secureFetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usn }),
    });

    return parseResponse(response);
  },

  resetPassword: async (token, password, confirmPassword) => {
    const response = await secureFetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
        confirmPassword,
      }),
    });

    return parseResponse(response);
  },

  getSession: async () => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        return null;
      }

      return parseResponse(response);
    } catch (error) {
      if (error instanceof TypeError) {
        throw createApiError(
          "Unable to connect to the server. Please try again.",
          0,
          "NETWORK_ERROR",
        );
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await secureFetch(`${API_URL}/users/logout`, {
        method: "POST",
      });

      return await parseResponse(response);
    } finally {
      csrfToken = null;
    }
  },

  getCurrentUser: () => null,

  setRememberMe: (usn) => {
    localStorage.setItem("rememberMe", usn);
  },

  getRememberMe: () => {
    return localStorage.getItem("rememberMe") || "";
  },

  clearRememberMe: () => {
    localStorage.removeItem("rememberMe");
  },
};

// export const authService = {
//   login: async (usn, password) => {
//     const response = await fetch("http://localhost:5000/api/users/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ usn, password }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Login failed.");
//     }

//     localStorage.setItem("user", JSON.stringify(data));

//     return data;
//   },

//   forgotPassword: async (usn) => {
//     const response = await fetch(
//       "http://localhost:5000/api/auth/forgot-password",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ usn }),
//       },
//     );
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to send reset link.");
//     }
//     return data;
//   },

//   resetPassword: async (token, password, confirmPassword) => {
//     const response = await fetch(
//       "http://localhost:5000/api/auth/reset-password",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token, password, confirmPassword }),
//       },
//     );
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to reset password.");
//     }

//     return data;
//   },

//   logout: () => {
//     localStorage.removeItem("user");
//   },

//   getToken: () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return user?.token;
//   },

//   getCurrentUser: () => {
//     return JSON.parse(localStorage.getItem("user"));
//   },

//   setRememberMe: (usn) => {
//     localStorage.setItem("rememberMe", usn);
//   },

//   getRememberMe: () => {
//     return localStorage.getItem("rememberMe") || "";
//   },

//   clearRememberMe: () => {
//     localStorage.removeItem("rememberMe");
//   },
// };

// export const authService = {
//   login: async (usn, password) => {
//     try {
//       const response = await fetch("http://localhost:5000/api/users/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ usn, password }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         if (data.token) {
//           localStorage.setItem(
//             "user",
//             JSON.stringify({
//               token: data.token,
//               usn: data.usn,
//               role: data.role,
//               userId: data.userId,
//             }),
//           );
//         } else {
//           console.error("Token not found in login response.");
//         }
//         return data;
//       } else {
//         throw new Error(data.error);
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error;
//     }
//   },
//   getProfile: async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       const token = user?.token;

//       if (!token) {
//         throw new Error("User not authenticated.");
//       }
//       const response = await fetch("http://localhost:5000/api/profiles", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         const existingUser = JSON.parse(localStorage.getItem("user"));
//         const updatedUser = {
//           ...existingUser,
//           id: data._id,
//           name: data.name,
//           email: data.email,
//         };
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         return updatedUser;
//       } else {
//         throw new Error(data.error || "Failed to fetch profile.");
//       }
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//       throw error;
//     }
//   },
//   getUserById: async (id) => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       const token = user?.token;
//       if (!token) throw new Error("User not authenticated.");
//       const response = await fetch(`http://localhost:5000/api/profiles/${id}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return await response.json();
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       throw error;
//     }
//   },

//   logout: () => {
//     localStorage.removeItem("user");
//   },

//   getCurrentUser: () => {
//     const user = localStorage.getItem("user");
//     return user ? JSON.parse(user) : null;
//   },

//   isAuthenticated: () => {
//     return !!localStorage.getItem("user");
//   },

//   setRememberMe: (usn) => {
//     localStorage.setItem("rememberMe", usn);
//   },

//   getRememberMe: () => {
//     return localStorage.getItem("rememberMe") || "";
//   },

//   clearRememberMe: () => {
//     localStorage.removeItem("rememberMe");
//   },
// };

// export const apiRequest = async (url, options = {}) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user?.token;

//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       ...(options.headers || {}),
//       "Content-Type": "application/json",
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   });
//   if (response.status === 401) {
//     authService.logout();
//     window.dispatchEvent(new Event("auth:expired"));
//     return Promise.reject(new Error("Session expired."));
//   }
//   const data = await response.json();
//   return data;
// };
