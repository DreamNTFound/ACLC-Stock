export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "₱0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
};
