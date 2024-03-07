const mongoose = require("mongoose");
const validator = require("validator");
const bycrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //This only works on CREATE OR SAVE!
      validator: function (el) {
        return this.password === el;
      },
      message: "Passwords do not match",
    },
  },
});

userSchema.pre("save", async function (next) {
  //Only run this function if password was actually changed
  if (!this.isModified("password")) return next();
  this.password = await bycrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (candidatePwd, userPwd) {
  return await bycrypt.compare(candidatePwd, userPwd);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
