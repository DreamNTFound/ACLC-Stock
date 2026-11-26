const express = require("express");
const router = express.Router();
const {
  createRestockSchedule,
  getAllRestockSchedules,
  updateRestockSchedule,
  deleteRestockSchedule,
} = require("../controllers/restockScheduleController");
const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, createRestockSchedule);
router.get("/", authenticate, getAllRestockSchedules);
router.put("/:id", authenticate, updateRestockSchedule);
router.delete("/:id", authenticate, deleteRestockSchedule);

module.exports = router;
