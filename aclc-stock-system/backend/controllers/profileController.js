const Profile = require("../models/profile");

exports.createProfile = async (req, res) => {
  try {
    const profile = await Profile.create({
      user: req.body.userId,
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
    });
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId }).populate(
      "userId",
      "usn role",
    );
    if (!profile) return res.status(404).json({ error: "Profile not found " });
    res.json({
      _id: profile._id,
      usn: profile.userId?.usn,
      role: profile.userId?.role,
      name: profile.name,
      email: profile.email,
      contact: profile.contact,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      req.body,
      { new: true },
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    console.log("Profile ID:", req.params.id);
    const profile = await Profile.findOne({ userId: req.params.id }).populate(
      "userId",
      "usn role",
    );
    console.log("Profile found:", profile);
    if (!profile) return res.status(404).json({ error: "Profile not found " });
    res.json({
      _id: profile._id,
      usn: profile.user?.usn,
      role: profile.user?.role,
      name: profile.name,
      email: profile.email,
      contact: profile.contact,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
