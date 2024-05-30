const { User } = require("../models/user");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const updateProfilePhoto = [
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      user.profilePicture = req.file.path;
      await user.save();
      res.json({ message: "Profile picture updated", user });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
];

module.exports = { profile, updateProfilePhoto }