import { api } from "./api";
import { secureFetch } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const restockScheduleService = {
  getAllRestockSchedules: () =>
    api(() =>
      secureFetch(`${API_URL}/restock-schedules`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ),

  createRestockSchedule: (reservation) =>
    api(() => {
      return secureFetch(`${API_URL}/restock-schedules`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
      });
    }),

  updateRestockSchedule: (id, updatedData) =>
    api(() => {
      return secureFetch(`${API_URL}/restock-schedules/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
    }),

  deleteRestockSchedule: (id) =>
    api(() =>
      secureFetch(`${API_URL}/restock-schedules/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ),
};
