const express = require("express");
const jwt = require("../middlewares/authMiddleware")
const {
  profile,
  updateProfilePhoto,
} = require("../controllers/userController");
// const { jwToken } = require("../utils/jwt");

const userRouter = express.Router();

userRouter.get("/profile", jwt, profile);
userRouter.post("/updatePhoto", jwt, updateProfilePhoto);

module.exports = { userRouter };
