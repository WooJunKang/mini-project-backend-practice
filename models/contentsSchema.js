
const mongoose = require('mongoose');
const { Timestamp } = require('bson');

const Schema = mongoose.Schema;

var contentsSchema = new Schema({
  user_id: String,
  user_name: String,
  password: String,
  content: String,
  created_at: Date,
  is_deleted: Boolean,
  deleted_at: Date
});

module.exports = mongoose.model('contents', contentsSchema);