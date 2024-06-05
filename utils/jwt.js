require("dotenv").config();
const jwt = require("jsonwebtoken");

async function jwToken(payload) {
  const token = jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return token;
}

module.exports = { jwToken };
