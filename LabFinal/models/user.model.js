const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: [String],
});

const UserModel = mongoose.model("User", usersSchema);

module.exports = UserModel;
