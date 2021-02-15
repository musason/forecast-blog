const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema({
  episodeId: String
});

const EpisodeModel = mongoose.model("episode", EpisodeSchema);
module.exports = EpisodeModel;
