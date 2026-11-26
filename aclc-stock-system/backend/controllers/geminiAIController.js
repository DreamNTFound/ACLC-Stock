const { getAIResponse } = require("../services/geminiService");
const Products = require("../models/products");
const {
  getCheapestProducts,
  getProductByName,
  findProductFromMessage,
} = require("../services/productService");

exports.chatbot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    const productData = await Products.find({
      item_visible: true,
    }).lean();

    let specialData = null;

    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("cheapest") ||
      lowerMessage.includes("lowest price")
    ) {
      const cheapestProducts = await getCheapestProducts();

      specialData = {
        type: "cheapest_products",
        products: cheapestProducts.map((product) => ({
          name: product.item_name,
          price: `₱${Number(product.item_price).toFixed(2)}`,
          stock: product.item_stock,
        })),
      };
    }

    const aiResponse = await getAIResponse(message, productData, specialData);

    res.json({
      reply: aiResponse,
    });
  } catch (error) {
    console.error("Chatbot Error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};
