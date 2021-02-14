const axios = require("axios").default;
const express = require("express");
const router = express.Router();
hbs = require("hbs")
hbs.registerPartials(__dirname + "/views/partials")

const checkLoggin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.render("signin", {msg: "Please sign in first"});
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
      next(err)
    })
})

module.exports = router;