const axios = require("axios").default;
const express = require("express");
const router = express.Router();
hbs = require("hbs");
hbs.registerPartials(__dirname + "/views/partials");

const checkLoggin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.render("signin", { msg: "Please sign in first" });
  }
};

router.get("/search", checkLoggin, (req, res, next) => {
  let result = req.session.user;
  res.render("search.hbs", { result });
});

router.post("/search", checkLoggin, (req, res, next) => {
  let key = process.env.API_KEY;
  const { seriesName } = req.body;
  axios
    .get(
      `https://api.themoviedb.org/3/search/tv?api_key=${key}&language=en-US&page=1&query=${seriesName}&include_adult=false`
    )
    .then((tvResult) => {
      let result = req.session.user;
      let searchResult = tvResult.data.results;
      res.render("search", { searchResult, result });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/search/:id", checkLoggin, (req, res, next) => {
  let key = process.env.API_KEY;
  let id = req.params.id;
  axios
    .get(`https://api.themoviedb.org/3/tv/${id}?api_key=${key}`)
    .then((result) => {
      let data = result.data;
      let seasons = result.data.seasons;
      let showName = data.name
      seasons.forEach(e => e.id = id)
      seasons.forEach((e) => (e.seriesName = showName));
      res.render("show", { data, result, seasons, id });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/search/:id/:season/:showname", checkLoggin, (req, res, next) => {
  let key = process.env.API_KEY;
  let seaNum = req.params.season;
  let seriesNewName = req.params.showname;
  let tvid = req.params.id;
  axios
    .get(
      `https://api.themoviedb.org/3/tv/${tvid}/season/${seaNum}?api_key=${key}`
    )
    .then((seasonResult) => {
      let episodesData = seasonResult.data.episodes
      let seasonData = seasonResult.data
      // let showName = seasonData.name
      episodesData.forEach((e) => (e.still_path = seriesNewName));
      res.render("season", { episodesData, seasonData });
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/:blog/:epid/:name/:showname', checkLoggin, (req, res, next) => {
  let epId = req.params.epId
  let blog = req.params.blog
  let eppName = req.params.name
  let eppShowName = req.params.showname;
  let today = new Date()
  let result = req.session.user
  today = JSON.stringify(today);
  today = today.slice(0, 11);
  res.render("tvblog", { eppName, eppShowName, result });
    
  




})

module.exports = router;