import { getStorage, setStorage } from "./storage";
import { api } from "./api";

const RESERVE_KEY = "reservations";

export const getReservations = () =>
  api(() => {
    return getStorage(RESERVE_KEY) || [];
  });

export const addReservation = (reservation) =>
  api(() => {
    const reservations = getStorage(RESERVE_KEY) || [];
    const newReservation = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...reservation,
    };
    const updatedReservations = [...reservations, newReservation];
    setStorage(RESERVE_KEY, updatedReservations);
    return newReservation;
  });

export const updateReservationStatus = (id, newStatus) =>
  api(() => {
    const reservations = getStorage(RESERVE_KEY) || [];
    const updatedReservations = reservations.map((reservation) =>
      reservation.id === id
        ? {
            ...reservation,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }
        : reservation,
    );
    setStorage(RESERVE_KEY, updatedReservations);
    return updatedReservations;
  });
