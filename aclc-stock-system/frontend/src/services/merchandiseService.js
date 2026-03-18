import { getStorage, setStorage } from "./storage";
import { api } from "./api";

const MERCHANDISE_KEY = "merchandise_items";

export const getItems = () =>
  api(() => {
    return getStorage(MERCHANDISE_KEY) || [];
  });

export const addItem = (item) =>
  api(() => {
    const items = getStorage(MERCHANDISE_KEY) || [];
    const newItem = { id: Date.now(), images: [], sizes: [], ...item };
    const updatedItems = [...items, newItem];
    setStorage(MERCHANDISE_KEY, updatedItems);
    return newItem;
  });

export const updateItem = (id, updatedData) =>
  api(() => {
    const items = getStorage(MERCHANDISE_KEY) || [];
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, ...updatedData } : item,
    );
    setStorage(MERCHANDISE_KEY, updatedItems);
    return updatedItems.find((item) => item.id === id);
  });

export const deleteItem = (id) =>
  api(() => {
    const items = getStorage(MERCHANDISE_KEY) || [];
    const filtered = items.filter((item) => item.id !== id);
    setStorage(MERCHANDISE_KEY, filtered);
    return filtered;
  });
