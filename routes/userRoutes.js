const express = require("express")
const { profile, updateProfilePhoto } = require("../controllers/userController")
const { jwToken } = require("../utils/jwt")

const userRouter = express.Router()

userRouter.get("/profile", jwToken, profile)
userRouter.post("/updatePhoto", jwToken, updateProfilePhoto)

module.exports = { userRouter }