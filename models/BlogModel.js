const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  comment: {
    type: String,
    minLength: 5
  },
  forecastcomment: {
    type: String,
    minLength: 5
  },
  episodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'episode'
  },
  myUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  myNickname: {
    type: mongoose.Schema.Types.String,
    ref: 'nick'
  }
});

const BlogModel = mongoose.model("blog", BlogSchema);
module.exports = BlogModel;
