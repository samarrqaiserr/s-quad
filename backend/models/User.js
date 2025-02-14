const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    role: {
      type: String,
      enum: ["contestant", "judge", "admin"],
      required: true,
    },
    profilePicture: { type: String }, // Store image URL
    oauthProvider: {
      type: String,
      enum: ["google", "facebook", "none"],
      default: "none",
    }, // OAuth details
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
