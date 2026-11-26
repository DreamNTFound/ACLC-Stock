export const validateReservation = ({
  item,
  selectedSize,
  quantity,
  selectedPaymentMethod,
}) => {
  if (item.item_sizes && item.item_sizes.length > 0 && !selectedSize) {
    return "Please select a size before reserving.";
  }

  if (quantity < 1) {
    return "Quantity must be at least 1.";
  }

  if (!selectedPaymentMethod) {
    return "Please select a payment method before reserving.";
  }

  return null;
};

export const buildReservationData = ({
  item,
  user,
  selectedSize,
  quantity,
  notes,
  paymentMethod,
  paymentStatus,
  gcashRef,
}) => ({
  productId: item._id,
  profileId: user._id,
  size: selectedSize,
  quantity,
  notes,
  status: "Pending",
  paymentMethod,
  paymentStatus,
  ...(gcashRef && { gcashRef }),
  created_at: new Date().toISOString(),
});
