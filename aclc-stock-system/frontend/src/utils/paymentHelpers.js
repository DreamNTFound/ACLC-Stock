export const validateGCashNumber = (gcashNumber) => {
  return /^09\d{9}$/.test(gcashNumber);
};

export const getPaymentAmount = ({ item, quantity }) => {
  if (!item) return 0;

  return item.item_price * quantity;
};
