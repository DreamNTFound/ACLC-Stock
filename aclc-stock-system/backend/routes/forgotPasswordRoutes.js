const express = require("express");
const router = express.Router();
const { getCsrfToken } = require("../middleware/csrfProtection");

const {
  forgotPassword,
  resetPassword,
} = require("../controllers/forgotPasswordController");

const { rateLimit } = require("express-rate-limit");

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

router.get("/csrf", getCsrfToken);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPasswordLimiter, resetPassword);

module.exports = router;

// const express = require("express");
// const router = express.Router();

// const {
//   forgotPassword,
//   resetPassword,
// } = require("../controllers/forgotPasswordController");

// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);

// module.exports = router;
