const express = require("express");
require("dotenv").config();
const { connectToAtlas } = require("./config");
const { authRouter } = require("./routes/authRoute");
const { userRouter } = require("./routes/userRoutes")
const { errorHandler } = require("./utils/errorHandler");

const PORT = process.env.PORT || 8000;
const app = express();
connectToAtlas();

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
