const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  COOKIE_NAME,
  cookieOptions,
  clearCookieOptions,
} = require("../config/authCookie");
const authenticate = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET;

exports.loginUser = async (req, res) => {
  try {
    const { usn, password } = req.body || {};

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        code: "SERVICE_UNAVAILABLE",
        message:
          "The system is temporarily unavailable. Please try again shortly.",
      });
    }

    if (
      typeof usn !== "string" ||
      typeof password !== "string" ||
      !usn.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter your username and password",
      });
    }

    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");

      return res.status(500).json({
        success: false,
        message:
          "Authentication service is unavailable. Please try again later.",
      });
    }

    // const user = await User.findOne({ usn: usn.trim() });

    // if (!user) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Invalid username or password" });
    // }

    // const isMatch = await user.matchPassword(password);

    const user = await User.findOne({ usn: usn.trim() });

    console.log("Login database:", mongoose.connection.name);
    console.log("USN lookup found user:", Boolean(user));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const isMatch = await user.matchPassword(password);

    console.log("Password matched:", isMatch);

    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid username or password" });
    }

    if (user.status !== "active") {
      let message = "Your account is currently inactive.";

      if (user.status === "inactive") {
        message = "Your account is inactive. Please contact the administrator.";
      } else if (user.status === "suspended") {
        message =
          "Your account has been suspended. Please contact the administrator.";
      }
      return res.status(403).json({ success: false, message });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie(COOKIE_NAME, token, cookieOptions);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      usn: user.usn,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error during login:", error);

    if (
      mongoose.connection.readyState !== 1 ||
      [
        "MongoServerSelectionError",
        "MongoNetworkError",
        "MongoNotConnectedError",
      ].includes(error.name)
    ) {
      return res.status(503).json({
        success: false,
        code: "SERVICE_UNAVAILABLE",
        message:
          "The system is temporarily unavailable. Please try again shortly.",
      });
    }

    return res.status(503).json({
      success: false,
      message: "Something went wrong while signing in. Please try again later.",
    });
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie(COOKIE_NAME, clearCookieOptions);
  return res.status(200).json({
    success: true,
    message: "Logged out successful",
  });
};

exports.getCurrentSession = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        usn: req.user.usn,
        role: req.user.role,
        status: req.user.status,
      },
    });
  } catch (error) {
    console.error("Session verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify session.",
    });
  }
};

// exports.loginUser = async (req, res) => {
//   const { usn, password } = req.body;

//   const user = await User.findOne({ usn });
//   if (!user) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Invalid Student ID or password" });
//   }

//   const payload = { id: user._id };
//   const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

//   res.json({
//     token,
//     usn: user.usn,
//     role: user.role,
//     userId: user._id,
//   });
// };
