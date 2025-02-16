const mongoose = require("mongoose");

const contestantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    songPreferences: [{ type: String }], // Array of song choices
    performanceVideos: [{ type: String }], // URLs of submitted performances
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contestant", contestantSchema);
