const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { AppError } = require("../utils/errorHandler");
const { jwToken } = require("../utils/jwt");

const signup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return next(new AppError("All fields are required", 400));
  }

  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "30min" });

    res.status(201).json({ token });
  } catch (err) {
    console.error("Error during registration:", err);
    next(new AppError("Server error", 500));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Invalid email", 400));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError("Invalid password", 400));
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: "30min",
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = { signup, login };
