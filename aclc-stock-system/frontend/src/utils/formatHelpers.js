export const categoryOptions = [
  "Uniform",
  "PE Uniform",
  "ID Lace",
  "School Supply",
  "Accessory",
  "Other",
];

export const statusOptions = ["In Stock", "Low Stock", "Out of Stock"];

export const reserveStatusOptions = [
  "Pending",
  "Ready for Pickup",
  "Claimed",
  "Cancelled",
];

export const paymentMethodOptions = ["GCash", "Cash"];

export const formDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatPostedDate = (date) => {
  if (!date) return "Unknown";

  return new Date(date).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
