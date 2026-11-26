import { api } from "./api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const userService = {
  getProfile: async () => {
    const profile = await api(() =>
      fetch(`${API_URL}/profiles`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    return profile;
  },

  getUserById: (id) =>
    api(() =>
      fetch(`${API_URL}/profiles/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ),
};
