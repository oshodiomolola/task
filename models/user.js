const mongoose = require("mongoose");
const { bcrypt } = require("bcrypt");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    minLength: 10,
    maxLenght: 20,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
  },
  // passwordConfirm: {
  //   type: String,
  //   required: [true, "Please confirm your password"],
  //   trim: true
  // }
});

UserSchema.pre("save", async function (next) {
  if (!this.isValid("password")) {
    return next;
  }
  const salt = await bcrypt.genSalt(50);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = { User };