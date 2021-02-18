const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema({
  episodeId: String,
  seriesName: String,
  seriesSeason: String,
  seriesEpisode: String,
  blogUrl: String
  // {
  //   type: String,
  //   required: "URL can't be empty",
  //   unique: true,
  // },
});

// EpisodeSchema.path("blogUrl").validate((val) => {
//   urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
//   return urlRegex.test(val);
// }, "Invalid URL.");

const EpisodeModel = mongoose.model("episode", EpisodeSchema);
module.exports = EpisodeModel;
