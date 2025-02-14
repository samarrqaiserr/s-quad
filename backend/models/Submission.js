const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  competitionNumber: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the 'User' model
    required: true,
  },
  mp3AudioUpload: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: null, // Initially null, only visible to judges
  },
  likes: {
    type: Number,
    default: null, // Initially null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Submission", submissionSchema);
