const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
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

    user = new User({ name, email, password: password });
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error("Error during registration:", err);
    next(new AppError("Server error", 500));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log("user not found");
      return next(new AppError("Invalid email", 400));
    }
    console.log(user);
    bcryptjs.compare(password, user.password).then(function (match) {
      console.log(res);
      console.log("PASSWORD :=>", user.password, password);
      console.log("Password comparison result:", match);
      if (!match) {
        console.log("invalid password");
        return next(new AppError("Invalid password", 400));
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "30min",
      });

      res.json({ token });
  }).catch(err => {
    throw new Error(err);
  });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = { signup, login };
