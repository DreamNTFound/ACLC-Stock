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
