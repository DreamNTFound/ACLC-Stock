import { getStorage, setStorage } from "./storage";
import { api } from "./api";

const LOCAL_SHOP_KEY = "localShop";
const RECOMMENDED_KEY = "shopRecommendation";

export const getLocalShop = () =>
  api(() => {
    return getStorage(LOCAL_SHOP_KEY) || [];
  });

export const addLocalShop = (shop) =>
  api(() => {
    const shops = getStorage(LOCAL_SHOP_KEY) || [];
    const newShops = { id: Date.now(), avail_items: [], ...shop };
    const updatedShops = [...shops, newShops];
    setStorage(LOCAL_SHOP_KEY, updatedShops);
    return newShops;
  });

export const updateLocalShop = (id, updatedData) =>
  api(() => {
    const shops = getStorage(LOCAL_SHOP_KEY) || [];
    const updatedShops = shops.map((shop) =>
      shop.id === id ? { ...shop, ...updatedData } : shop,
    );
    setStorage(LOCAL_SHOP_KEY, updatedShops);
    return updatedShops.find((shop) => shop.id === id);
  });

export const deleteLocalShop = (id) =>
  api(() => {
    const shops = getStorage(LOCAL_SHOP_KEY) || [];
    const filtered = shops.filter((shop) => shop.id !== id);
    setStorage(LOCAL_SHOP_KEY, filtered);
    return filtered;
  });

export const setRecommendedShop = (shopId) =>
  api(() => {
    setStorage(RECOMMENDED_KEY, { id: shopId });
  });

export const getRecommendedShops = (itemName) =>
  api(() => {
    const shops = getStorage(LOCAL_SHOP_KEY) || [];
    const recommendation = shops.filter((shop) =>
      shop.avail_items.includes(itemName),
    );
    if (!recommendation || recommendation.length === 0) return null;
    return recommendation;
  });
