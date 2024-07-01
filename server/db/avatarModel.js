const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema({
  file_name: { type: String },

  date_time: { type: Date, default: Date.now },

  user_id: mongoose.Schema.Types.ObjectId,
  encode_image: { type: String },
});

const Avatar = mongoose.model("Avatar", avatarSchema);

module.exports = Avatar;
