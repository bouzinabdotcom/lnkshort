const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const LnkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  lid: {
    type: String,
    required: true,
    unique: true,
    index: true,
    min: 3,
    max: 20,
  },
  lnk: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
    index: true,
  },
});

const Lnk = mongoose.model("Lnk", LnkSchema);

module.exports = Lnk;
