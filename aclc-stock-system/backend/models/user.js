const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const login = new mongoose.Schema(
  {
    usn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "student"],
      default: "student",
    },

    // Password reset information
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordTokenExpires: {
      type: Date,
      default: null,
    },

    // Account status
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    // Used to invalidate previously issued JWTs
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Hashed password
login.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password during login
login.methods.matchPassword = async function (confirmPassword) {
  return await bcrypt.compare(confirmPassword, this.password);
};

// Demo Credentials
login.statics.addUsers = async function (usn, password, role) {
  return this.create({ usn, password, role, status: "active" });
};

// Create the model from the schema
const User = mongoose.model("User", login);

module.exports = User;
