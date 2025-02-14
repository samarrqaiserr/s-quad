const Contestant = require("../models/contestantModel");

// Fetch contestant profile
const getContestantProfile = async (req, res) => {
  try {
    const contestant = await Contestant.findById(req.params.id);
    if (!contestant) {
      return res.status(404).json({ message: "Contestant not found" });
    }
    res.status(200).json(contestant);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update contestant profile
const updateContestantProfile = async (req, res) => {
  try {
    const updatedProfile = await Contestant.findByIdAndUpdate(
      req.params.id,
      {
        songPreference: req.body.songPreference,
        performanceDetails: req.body.performanceDetails,
        profilePicture: req.body.profilePicture,
      },
      { new: true }
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getContestantProfile,
  updateContestantProfile,
};
