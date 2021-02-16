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
}

let key = process.env.API_KEY;


router.get('/tvblog', checkLoggin, (req, res, next) => {
  let result = req.session.user;
  axios.get(
    `https://api.themoviedb.org/3/tv/popular?api_key=${key}&language=en-US&page=1`
  )
    .then((popularShow) => {
      let popShowData = popularShow.data.results;
      res.render("popularshow", {result, popShowData });
    })
    .catch((err) => {
      next(err)      
    })

})


module.exports = router;