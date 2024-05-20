const mongoose = require("mongoose");

const userProgramSchema = new mongoose.Schema({
  program_name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  language: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
  },
  lastOutput: {
    type: String,
  },
});

//Model
const UserProgramModel = mongoose.model("UserProgram", userProgramSchema);
module.exports = UserProgramModel;
