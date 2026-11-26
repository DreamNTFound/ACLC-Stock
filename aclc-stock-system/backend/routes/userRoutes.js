const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");

const {
  loginUser,
  logoutUser,
  getCurrentSession,
} = require("../controllers/userController");
const { rateLimit } = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

router.get("/me", authenticate, getCurrentSession);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", logoutUser);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { loginUser } = require("../controllers/userController");

// router.post("/login", loginUser);

// module.exports = router;
