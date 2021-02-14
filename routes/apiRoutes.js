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
  res.render("search.hbs");
});

router.post("/search", checkLoggin, (req, res, next) => {
  let key = process.env.API_KEY;
  const { seriesName } = req.body;
  axios
    .get(
      `https://api.themoviedb.org/3/search/tv?api_key=${key}&language=en-US&page=1&query=${seriesName}&include_adult=false`
    )
    .then((result) => {
      let searchResult = result.data.results;
      res.render("search", { searchResult });
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
      for (let i = 0; i < seasons.length; i++) {
        let seasonId = seasons[i].id
        let seasonNum = seasons[i].season_number
        axios.get(`https://api.themoviedb.org/3/tv/${seasonId}/season/${seasonNum}?api_key=999f732f38fbef834fc946a9df9d5c5e`)
          .then((epResult) => {
            let epArray = epResult.data.episodes
            console.log(epArray[1])
            let epNumArr = []
            for (let j = 0; j < epArray.length; j++){
              // console.log(epArray[j])
              epNumArr.push(epArray[j].episode_number)
            }
            
            // console.log(epNumArr)
            res.render("show", { data, result, seasons, epNumArr });
          })
          .catch((err) => {
            console.log(err)
          })
      }
      // res.render("show", { data, result, seasons, epNumArr});
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
