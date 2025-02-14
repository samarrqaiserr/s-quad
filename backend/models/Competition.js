const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const competitionSchema = new Schema({
  competitionNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  details: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Competition", competitionSchema);
