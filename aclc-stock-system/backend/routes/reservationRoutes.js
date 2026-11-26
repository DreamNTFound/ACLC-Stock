const express = require("express");
const router = express.Router();
const {
  createReservation,
  getAllReservations,
  getMyReservation,
  updateReservation,
  cancelReservation,
} = require("../controllers/reservationController");
const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, createReservation);
router.get("/", authenticate, getAllReservations);
router.get("/user/:profileId", authenticate, getMyReservation);
router.put("/:id", authenticate, updateReservation);
router.patch("/:id/cancel", authenticate, cancelReservation);

module.exports = router;
