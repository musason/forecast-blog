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

router.get("/search",checkLoggin, (req, res, next) => {
  let result = req.session.user;
  res.render("search.hbs", {result});
});

router.post('/search', checkLoggin, (req, res, next) => {
  let key = process.env.API_KEY
  const {seriesName} = req.body
  axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${key}&language=en-US&page=1&query=${seriesName}&include_adult=false`)
    .then((tvResult) => {
      let result = req.session.user;
      let searchResult = tvResult.data.results
      res.render('search', {searchResult, result})
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
      let seasonNumber = seasons[0].season_number
      let epNumArr = []
      // let seasonNum = seasons[i].season_number
      axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${key}`)
        .then((epResult) => {
          // let epArray = epResult.data
          console.log(seasonNumber);
          // console.log(epArray)
          // for (let j = 0; j < epArray.length; j++){
          //   // console.log(epArray[j])
          //   epNumArr.push(epArray[j].episode_number)
          // }
          
          // // console.log(epNumArr)
          res.render("show", { data, result, seasons, seasonNumber });
        })
        .catch((err) => {
          // console.log(err)
        })
      // res.render("show", { data, result, seasons});
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
