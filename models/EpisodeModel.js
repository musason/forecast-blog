const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema({
  episodeId: String,
  seriesName: String,
  seriesSeason: String,
  seriesEpisode: String,
  blogUrl: String
});

const EpisodeModel = mongoose.model("episode", EpisodeSchema);
module.exports = EpisodeModel;
