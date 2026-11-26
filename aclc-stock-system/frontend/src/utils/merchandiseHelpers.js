export const getTotalStock = (item) => {
  if (item.item_sizes && item.item_sizes.length > 0) {
    return item.item_sizes.reduce(
      (total, size) => total + Number(size.item_stock),
      0,
    );
  }

  return Number(item.item_stock || 0);
};

export const getStockStatus = (item) => {
  const totalStock = getTotalStock(item);
  if (totalStock === 0) return "Out of Stock";
  if (totalStock <= 5) return "Low Stock";
  if (totalStock > 5) return "In Stock";
  return item.item_stock;
};
