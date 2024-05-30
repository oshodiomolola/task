const express = require("express")
const { profile, updateProfilePhoto } = require("../controllers/userController")
const auth = require("../utils/jwt")

const userRouter = express.Router()

userRouter.get("/profile", auth, profile)
userRouter.post("/updatePhoto", auth, updateProfilePhoto)