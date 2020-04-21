const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    min: 5,
    max: 30,
  },
  pwd: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
