import { getStorage, setStorage } from "./storage";
import { api } from "./api";

const RESTOCK_SCHEDULE_KEY = "restock_schedule";

export const getSched = () =>
  api(() => {
    return getStorage(RESTOCK_SCHEDULE_KEY) || [];
  });

export const addSched = (sched) =>
  api(() => {
    const scheds = getStorage(RESTOCK_SCHEDULE_KEY) || [];
    const newSched = { id: Date.now(), ...sched };
    const updatedSched = [...scheds, newSched];
    setStorage(RESTOCK_SCHEDULE_KEY, updatedSched);
    return newSched;
  });

export const updateSched = (id, updatedData) =>
  api(() => {
    const scheds = getStorage(RESTOCK_SCHEDULE_KEY) || [];
    const updatedSched = scheds.map((sched) =>
      sched.id === id ? { ...scheds, ...updatedData } : sched,
    );
    setStorage(RESTOCK_SCHEDULE_KEY, updatedSched);
    return updatedSched.find((sched) => sched.id === id);
  });

export const deleteSched = (id) =>
  api(() => {
    const scheds = getStorage(RESTOCK_SCHEDULE_KEY) || [];
    const filtered = scheds.filter((sched) => sched.id !== id);
    setStorage(RESTOCK_SCHEDULE_KEY, filtered);
    return filtered;
  });
