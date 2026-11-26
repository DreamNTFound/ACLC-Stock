import { api } from "./api";
import { secureFetch } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const reservationService = {
  getAllReservation: () => {
    return api(() =>
      secureFetch(`${API_URL}/reservations`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
  },

  getMyReservation: async (profileId) => {
    return api(() =>
      secureFetch(`${API_URL}/reservations/user/${profileId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
  },

  addReservation: (reservation) =>
    api(() => {
      return secureFetch(`${API_URL}/reservations`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
      });
    }),

  updateReservation: (reservationId, updatedData) =>
    api(() => {
      return secureFetch(`${API_URL}/reservations/${reservationId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
    }),

  cancelReservation: (reservationId) =>
    api(() => {
      return secureFetch(`${API_URL}/reservations/${reservationId}/cancel`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }),
};
