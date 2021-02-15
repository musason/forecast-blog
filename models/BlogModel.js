const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    minLength: 5
  },
  episodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'episode'
  },
  myUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
});

const BlogModel = mongoose.model("blog", BlogSchema);
module.exports = BlogModel;
