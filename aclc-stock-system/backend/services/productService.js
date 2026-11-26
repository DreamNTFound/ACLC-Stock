const Products = require("../models/products");

exports.getCheapestProducts = async () => {
  const product = await Products.find({
    item_visible: true,
    item_stock: { $gt: 0 },
  })
    .sort({ item_price: 1 })
    .lean();

  if (!product.length) {
    return [];
  }

  const cheapestPrice = product[0].item_price;

  return product.filter((product) => product.item_price === cheapestPrice);
};

exports.getProductByName = async (productName) => {
  const product = await Products.findOne({
    item_visible: true,
    item_name: {
      $regex: new RegExp(`^${productName.trim()}$`, "i"),
    },
  }).lean();

  return product;
};

exports.findProductFromMessage = async (message) => {
  const products = await Products.find({
    item_visible: true,
  })
    .select("item_name")
    .lean();

  const lowerMessage = message.toLowerCase();

  const product = products.find((product) =>
    lowerMessage.includes(product.item_name.toLowerCase()),
  );

  return product || null;
};
