// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// const Schema = mongoose.Schema;
// const UserSchema = new Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     // unique: true,
//     minLength: 10,
//     trim: true,
//   },
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   photo: {
//     type: String,
//   }
// });

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next;
//   }
//   const salt = await bcrypt.genSalt(10);
//   console.log('Generated Salt:', salt);
//     this.password = await bcrypt.hash(this.password, salt);
//     console.log('Hashed Password before save:', this.password);
//     next();
// });

// UserSchema.methods.comparePassword = async function (password) {
//   const isMatch = await bcrypt.compare(password, this.password);
//   console.log('Password to Compare:', password);
//   console.log('Hashed Password in DB:', this.password);
//   console.log('Password Match Result:', isMatch);
//   return isMatch;
// };

// const User = mongoose.model("User", UserSchema);
// module.exports = { User };



const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passwordValidator = require('password-validator');
const winston = require('winston');

// Create a logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'auth.log' })
  ]
});

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
    minlength: 10,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
  }
});

// Create a password validation schema
const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(10)                                    
  .has().uppercase()                               
  .has().lowercase()                               
  .has().digits()                                  
  .has().symbols()                                 
  .is().not().oneOf(['Passw0rd', 'Password123']);  

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  
  if (!passwordSchema.validate(this.password)) {
    const error = new Error("Password does not meet security requirements.");
    logger.error("Password validation failed", { email: this.email });
    return next(error);
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    logger.info('Generated Salt', { salt: salt, email: this.email });
    this.password = await bcrypt.hash(this.password, salt);
    logger.info('Hashed Password before save', { hashedPassword: this.password, email: this.email });
    next();
  } catch (err) {
    logger.error('Error during password hashing', { error: err, email: this.email });
    next(err);
  }
});


UserSchema.methods.comparePassword = async function (password) {
  try {
    if (!password || !this.password) {
      logger.error('Password comparison failed due to missing data', { inputPassword: password, storedHash: this.password });
      throw new Error('Password comparison failed due to missing data');
    }

    logger.info('Comparing Password', { inputPassword: password, storedHash: this.password });
    const isMatch = await bcrypt.compare(password, this.password);
    logger.info('Password comparison result', { inputPassword: password, storedHash: this.password, result: isMatch });

    if (!isMatch) {
      const salt = this.password.slice(0, 29);
      const manualHash = await bcrypt.hash(password, salt);
      logger.info('Manual hash result', { inputPassword: password, manualHash: manualHash, storedHash: this.password });
    }

    return isMatch;
  } catch (err) {
    logger.error('Error during password comparison', { error: err, email: this.email });
    throw err;
  }
};

const User = mongoose.model("User", UserSchema);
module.exports = { User };


const inputPassword = 'rebelle1234567890';
const storedHash = '$2b$10$vF4./Nne7lotA3XH/PP51eggaz4cSo/S9xmdw6oj9ryHFxPgZ4i4i';

(async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(inputPassword, salt);
    logger.info('Generated Salt and Hash', { salt, hashedPassword });

    const isMatch = await bcrypt.compare(inputPassword, storedHash);
    logger.info('Password comparison result', { inputPassword, storedHash, result: isMatch });

    const extractedSalt = storedHash.slice(0, 29);
    const manualHash = await bcrypt.hash(inputPassword, extractedSalt);
    logger.info('Manual hash result', { inputPassword, manualHash, storedHash });

    if (!isMatch) {
      logger.error('Hash mismatch detected. Further  estigation required.', { inputPassword, manualHash, storedHash });
    }
  } catch (err) {
    logger.error('Error during bcrypt test', { error: err });
  }
})();
