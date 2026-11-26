const express = require("express");
const router = express.Router();
const {
  createProfile,
  getProfile,
  updateProfile,
  getProfileById,
} = require("../controllers/profileController");
const authenticate = require("../middleware/authMiddleware");

router.post("/", createProfile);
router.get("/", authenticate, getProfile);
router.put("/", updateProfile);
router.get("/:id", authenticate, getProfileById);

module.exports = router;
