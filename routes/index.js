const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel.js");
const bcrypt = require("bcryptjs");
const axios = require("axios").default;
const BlogModel = require("../models/BlogModel.js");

/* GET home page */
router.get("/", (req, res, next) => {
  let result = req.session.user;
  res.render("index", { result });
});

router.get("/about", (req, res, next) => {
  let result = req.session.user;
  res.render("about", { result });
});

//Sign Up GET Route
router.get("/signup", (req, res, next) => {
  res.render("signup.hbs");
});
//Sign Up POST Route
router.post("/signup", (req, res, next) => {
  const { nickname, email, password } = req.body;

  //User Validation
  if (!nickname || !email || !password) {
    res.render("/singup", { msg: "Please enter all field" });
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);

  UserModel.create({ nickname, email, password: hash })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
});

//Sign In GET Route
router.get("/signin", (req, res, next) => {
  let result = req.session.user;
  res.render("signin.hbs");
});
//Sign In POST Route
router.post("/signin", (req, res, next) => {
  const { nickname, password } = req.body;
  UserModel.findOne({ nickname: nickname })
    .then((result) => {
      if (result) {
        bcrypt
          .compare(password, result.password)
          .then((match) => {
            if (match) {
              req.session.user = result;
              res.redirect(`/profile/${result.id}`);
            } else {
              res.render("signin.hbs", { msg: "Password was incorect" });
            }
          })
          .catch((err) => {
            next(err);
          });
      } else {
        res.render("signin.hbs", { msg: "Username does not exist" });
      }
    })
    .catch((err) => {
      next(err);
    });
});

//Handling the Profile Page
const checkLoggin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/signin");
  }
};

router.get("/profile/:id", checkLoggin, (req, res, next) => {
  let result = req.session.user;
  let id = req.params.id;
  BlogModel.find()
    .populate("episodeId")
    .then((userResult) => {
      userResult.forEach((ele) => {
        if (JSON.stringify(ele.myUserId) == JSON.stringify(result._id)) {
          ele.blogWriter = true;
        }
      });
      res.render("profile", { userResult, result });
    })
    .catch(() => {});
});

router.get("/logout", checkLoggin, (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
