const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: false,
  },
});

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
