const crypto = require("crypto");
const User = require("../models/user");
const Profile = require("../models/profile");
const { sendResetPasswordEmail } = require("../utils/email");

const FRONTEND_URL = process.env.FRONTEND_URL;

// Forgot Password Controller
exports.forgotPassword = async (req, res) => {
  try {
    const { usn } = req.body || {};

    if (typeof usn !== "string" || !usn.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your Student ID.",
      });
    }

    if (usn.trim().length < 64) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID.",
      });
    }

    if (!FRONTEND_URL) {
      throw new Error("FRONTEND_URL is not defined in environment variables.");
    }

    const genericMessage =
      "If an account exist with that Student ID, password reset instructions will be sent to the registered email.";

    const user = await User.findOne({ usn: usn.trim(), status: "active" });

    if (!user) {
      return res.status(200).json({ success: true, message: genericMessage });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {
      await sendResetPasswordEmail(profile.email, resetLink);
    } catch (emailError) {
      user.resetPasswordToken = null;
      user.resetPasswordTokenExpires = null;
      await user.save();

      throw emailError;
    }

    return res.status(200).json({
      success: true,
      message: genericMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process your request. Please try again later.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body || {};

    if (
      typeof token !== "string" ||
      !token ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required information.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    if (password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password must not exceed 128 characters.",
      });
    }

    if (
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase letters, lowercase letters, and numbers.",
      });
    }

    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOneAndUpdate(
      {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpires: { $gt: Date.now() },
        status: "active",
      },
      {
        $set: {
          resetPasswordToken: null,
          resetPasswordTokenExpires: null,
        },
        $inc: {
          tokenVersion: 1,
        },
      },
      {
        new: true,
      },
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired.",
      });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully. Please log in again.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset your password. Please try again later.",
    });
  }
};

// const crypto = require("crypto");
// const User = require("../models/user");
// const Profile = require("../models/profile");
// const { sendResetPasswordEmail } = require("../utils/email");

// exports.forgotPassword = async (req, res) => {
//   try {
//     const { usn } = req.body;

//     const user = await User.findOne({ usn });

//     if (!user) {
//       return res.json({
//         message:
//           "If the student ID exists, a reset link will be sent to the registered email.",
//       });
//     }

//     // Find the profile to get the email
//     const profile = await Profile.findOne({
//       userId: user._id,
//     });

//     if (!profile) {
//       return res.json({
//         message:
//           "If the student ID exists, a reset link will be sent to the registered email.",
//       });
//     }

//     const resetToken = crypto.randomBytes(32).toString("hex");

//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     // Store reset information on User
//     user.resetPasswordToken = hashedToken;
//     user.resetPasswordTokenExpires = Date.now() + 3600000;

//     await user.save();

//     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

//     await sendResetPasswordEmail(profile.email, resetLink);

//     return res.json({
//       message:
//         "If the student ID exists, a reset link will be sent to the registered email.",
//     });
//   } catch (error) {
//     console.error("Error sending reset link:", error);

//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// exports.resetPassword = async (req, res) => {
//   try {
//     const { token, password } = req.body;

//     if (!token || !password) {
//       return res.status(400).json({
//         error: "Token and new password are required.",
//       });
//     }

//     if (password.length < 8) {
//       return res.status(400).json({
//         error: "Password must be at least 8 characters long.",
//       });
//     }

//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordTokenExpires: {
//         $gt: Date.now(),
//       },
//     });

//     if (!user) {
//       return res.status(400).json({
//         error: "Reset link is invalid or has expired.",
//       });
//     }

//     // Your User model's pre-save middleware hashes this
//     user.password = password;

//     // Invalidate token
//     user.resetPasswordToken = null;
//     user.resetPasswordTokenExpires = null;

//     await user.save();

//     return res.json({
//       message: "Password has been reset successfully.",
//     });
//   } catch (error) {
//     console.error("Error resetting password:", error);

//     res.status(500).json({
//       error: error.message || "Something went wrong while resetting password.",
//     });
//   }
// };
