const express = require("express");
const router = express.Router();
const {
  createLocalShop,
  getAllLocalShops,
  updateLocalShop,
  deleteLocalShop,
} = require("../controllers/localShopController");
const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, createLocalShop);
router.get("/", authenticate, getAllLocalShops);
router.put("/:id", authenticate, updateLocalShop);
router.delete("/:id", authenticate, deleteLocalShop);
// router.post("/recommend", authenticate, getRecommendShop);

module.exports = router;
