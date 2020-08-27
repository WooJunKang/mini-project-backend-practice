
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var userSchema = new Schema({
  user_name: String,
  is_admin: Boolean
  });

module.exports = mongoose.model('users', userSchema);