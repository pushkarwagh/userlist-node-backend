const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  leadId: {
    type: String,
    required: false,
    default: 0,
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  profile: {
    type: String,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    required: false,
  }
});

const Users = mongoose.model("Users", UserSchema);
module.exports = Users;