import { api } from "./api";
import { secureFetch } from "./authService";

export const restockScheduleService = {
  getAllRestockSchedules: () =>
    api(() =>
      secureFetch("http://localhost:5000/api/restock-schedules", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ),

  createRestockSchedule: (reservation) =>
    api(() => {
      return secureFetch("http://localhost:5000/api/restock-schedules", {
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
      return secureFetch(`http://localhost:5000/api/restock-schedules/${id}`, {
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
      secureFetch(`http://localhost:5000/api/restock-schedules/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ),
};
