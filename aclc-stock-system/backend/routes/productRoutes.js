const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProduct,
  getAllProductsForAdmin,
  archiveProduct,
  restoreProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");
const authenticate = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Restrict archive operations and the full inventory listing to administrators.
// Adjust this check if your auth middleware uses a different user property or role value.
function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Administrator access required" });
  }

  next();
}

// Existing product routes
router.post("/", authenticate, upload.array("item_images"), createProduct);
router.get("/", authenticate, getAllProduct);

// Admin inventory: active + archived products
router.get("/admin/all", authenticate, requireAdmin, getAllProductsForAdmin);

//Archive and restore
router.patch("/:id/archive", authenticate, requireAdmin, archiveProduct);
router.patch("/:id/restore", authenticate, requireAdmin, restoreProduct);

// Existing update and permanently delete product routes
router.put("/:id", authenticate, upload.array("item_images"), updateProduct);
router.delete("/:id", authenticate, deleteProduct);

module.exports = router;
