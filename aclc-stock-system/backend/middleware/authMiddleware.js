const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { COOKIE_NAME } = require("../config/authCookie");

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          "Authentication service is unavailable. Please try again later.",
      });
    }

    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required." });
    }

    const decode = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decode.id).select(
      "-password -resetPasswordToken -resetPasswordTokenExpires",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your session is no longer valid. Please log in again.",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message:
          "Your account is no longer active. Please contact the administrator.",
      });
    }

    const tokenVersion = decode.tokenVersion ?? 0;
    const currentVersion = user.tokenVersion ?? 0;

    if (tokenVersion !== currentVersion) {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    }

    req.user = user;
    req.userId = user._id.toString();
    req.userRole = user.role;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Your sessiona is invalid or has expired.",
      });
    }
    console.error("Authentication middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to authenticate your request.",
    });
  }
};

module.exports = authenticate;

// const jwt = require("jsonwebtoken");
// const JWT_SECRET = process.env.JWT_SECRET;

// const authenticate = (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   try {
//     const decode = jwt.verify(token, JWT_SECRET);
//     req.userId = decode.id;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: "Token is not valid" });
//   }
// };

// module.exports = authenticate;
