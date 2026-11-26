import { api } from "./api";
import { secureFetch } from "./authService";

export const reservationService = {
  getAllReservation: () => {
    return api(() =>
      secureFetch("http://localhost:5000/api/reservations", {
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
      secureFetch(`http://localhost:5000/api/reservations/user/${profileId}`, {
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
      return secureFetch("http://localhost:5000/api/reservations", {
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
      return secureFetch(
        `http://localhost:5000/api/reservations/${reservationId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        },
      );
    }),

  cancelReservation: (reservationId) =>
    api(() => {
      return secureFetch(
        `http://localhost:5000/api/reservations/${reservationId}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }),
};
