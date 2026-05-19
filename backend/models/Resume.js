const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  atsScore: Number,

  matchedSkills: [String],

  missingSkills: [String],

  feedback: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", resumeSchema);