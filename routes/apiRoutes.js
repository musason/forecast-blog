const axios = require("axios").default;
const express = require("express");
const router = express.Router();
hbs = require("hbs");
hbs.registerPartials(__dirname + "/views/partials");
const BlogModel = require("../models/BlogModel.js");
const EpisodeModel = require("../models/EpisodeModel.js");

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
  if (seriesName) {
    axios
      .get(
        `https://api.themoviedb.org/3/search/tv?api_key=${key}&language=en-US&page=1&query=${seriesName}&include_adult=false`
      )
      .then((tvResult) => {
        console.log(tvResult.data);
        let result = req.session.user;
        let searchResult = tvResult.data.results;
        res.render("search", { searchResult, result });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.redirect("/tvblog");
  }
});

router.get("/search/:id", checkLoggin, (req, res, next) => {
  let key = process.env.API_KEY;
  let id = req.params.id;
  let result = req.session.user;
  axios
    .get(`https://api.themoviedb.org/3/tv/${id}?api_key=${key}`)
    .then((searchSeasonResult) => {
      let data = searchSeasonResult.data;
      let seasons = searchSeasonResult.data.seasons;
      let showName = data.name;
      seasons.forEach((e) => (e.id = id));
      seasons.forEach((e) => (e.seriesName = showName));
      res.render("show", { data, searchSeasonResult, seasons, id, result });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/search/:id/:season/:showname", checkLoggin, (req, res, next) => {
  let result = req.session.user;
  let key = process.env.API_KEY;
  let seaNum = req.params.season;
  let seriesNewName = req.params.showname;
  let tvid = req.params.id;
  axios
    .get(
      `https://api.themoviedb.org/3/tv/${tvid}/season/${seaNum}?api_key=${key}`
    )
    .then((seasonResult) => {
      let today = new Date();
      today = JSON.stringify(today);
      today = today.slice(1, 11);
      let episodesData = seasonResult.data.episodes;
      let seasonData = seasonResult.data;

      episodesData.forEach((ele) => {
        if (ele.air_date <= today) {
          ele.foreCast = true;
        }
      });

      episodesData.forEach((e) => {
        if (!e.air_date) {
          e.dateFalse = true;
        }
      });

      episodesData.forEach((e) => (e.still_path = seriesNewName));
      res.render("season", { episodesData, seasonData, result });
    })
    .catch((err) => {
      next(err);
    });
});

router.get(
  "/:airdate/:epid/:name/:showname/:season",
  checkLoggin,
  (req, res, next) => {
    let epId = req.params.epid;
    let airDate = req.params.airdate;
    let seasonName = req.params.season;
    let eppName = req.params.name;
    let eppShowName = req.params.showname;
    let today = new Date();
    let result = req.session.user;
    today = JSON.stringify(today);
    today = today.slice(1, 11);

    EpisodeModel.findOne({ episodeId: epId })
      .then((episodeResult) => {
        if (episodeResult) {
          let newEpId = episodeResult._id;
          BlogModel.find({ episodeId: newEpId })
            .then((blogValueFromMongo) => {
              const blogValue = JSON.parse(JSON.stringify(blogValueFromMongo));
              //Adjusting timestamps Format
              blogValue.forEach((e) => {
                if (e.createdAt) {
                  e.dateOfCreation = e.createdAt.slice(0, -8);
                }
              });


              blogValue.forEach((ele) => {
                if (JSON.stringify(ele.myUserId) == JSON.stringify(result._id)) {
                    ele.blogOwner = true;
                }
              });
              if (airDate <= today) {
                res.render("tvblog", {
                  eppName,
                  eppShowName,
                  episodeResult,
                  seasonName,
                  epId,
                  airDate,
                  blogValue,
                  result,
                });
              } else {
                res.render("forecast", {
                  eppName,
                  eppShowName,
                  episodeResult,
                  seasonName,
                  epId,
                  airDate,
                  blogValue,
                  result,
                });
              }
            })
            .catch(() => {});
        } else {
          if (airDate <= today) {
            res.render("tvblog", {
              eppName,
              eppShowName,
              episodeResult,
              seasonName,
              epId,
              airDate,
              result,
            });
          } else {
            res.render("forecast", {
              eppName,
              eppShowName,
              episodeResult,
              seasonName,
              epId,
              airDate,
              result,
            });
          }
        }
      })
      .catch(() => {});
  }
);

router.post(
  "/:airdate/:epid/:name/:showname/:season",
  checkLoggin,
  (req, res, next) => {
    const { comment, forecastcomment } = req.body;
    const { airdate, epid, name, showname, season } = req.params;
    const pageResult = { airdate, epid, name, showname, season };
    let result = req.session.user;
    let today = new Date();
    today = JSON.stringify(today);
    today = today.slice(1, 11);

    EpisodeModel.findOne({ episodeId: epid })
      .then((epFindResult) => {
        console.log(epFindResult)
        if (epFindResult) {
          if (airdate <= today) {
            BlogModel.create({
              comment,
              episodeId: epFindResult._id,
              myUserId: result._id,
              myNickname: result.nickname,
            })
              .then((value) => {
              res.redirect(
                `/${airdate}/${epid}/${name}/${showname}/${season}`
              );
            })
            .catch(() => {});
          } else {
            BlogModel.create({
              forecastcomment,
              episodeId: epFindResult._id,
              myUserId: result._id,
              myNickname: result.nickname,
            })
              .then((value) => {
                res.redirect(
                  `/${airdate}/${epid}/${name}/${showname}/${season}`
                );
              })
              .catch(() => {});
          }
        } else {
          EpisodeModel.create({
            myNickname: result.nickname,
            episodeId: epid,
            seriesName: showname,
            seriesSeason: season,
            seriesEpisode: name,
            blogUrl: `/${airdate}/${epid}/${name}/${showname}/${season}`,
          })
            .then((epFindResult) => {
              if (airdate <= today) {
                BlogModel.create({
                  myNickname: result.nickname,
                  comment,
                  episodeId: epFindResult._id,
                  myUserId: result._id,
                })
                  .then(() => {
                    res.redirect(
                      `/${airdate}/${epid}/${name}/${showname}/${season}`
                    );
                  })
                  .catch(() => {});
              } else {
                BlogModel.create({
                  myNickname: result.nickname,
                  forecastcomment,
                  episodeId: epFindResult._id,
                  myUserId: result._id,
                })
                  .then(() => {
                    res.redirect(
                      `/${airdate}/${epid}/${name}/${showname}/${season}`
                    );
                  })
                  .catch(() => {});
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => {});
  }
);

// Deleting the blogPost

router.post("/:blogId/delete", checkLoggin, (req, res, next) => {
  let blogDatabaseId = req.params.blogId;
  let result = req.session.id;
  BlogModel.findByIdAndDelete(blogDatabaseId)
    .then((deleteResult) => {
      res.redirect("back");
    })
    .catch((err) => {
      next(err);
    });
});

//Editing the blogPost

router.get(
  "/:airdate/:epid/:name/:showname/:season/:thisid/edit",
  checkLoggin,
  (req, res, next) => {
    // const { airDate, epId, eppName, eppShowName, seasonName, blogDatabaseId } = req.params;
    let airDate = req.params.airdate;
    let epId = req.params.epid;
    let eppName = req.params.name;
    let eppShowName = req.params.showname;
    let seasonName = req.params.season;
    let thisBlogId = req.params.thisid;
    let result = req.session.user;

    console.log(thisBlogId);
    BlogModel.findById(thisBlogId)
      .then((someBlogValue) => {

        res.render("blog-update", {
          airDate,
          epId,
          eppName,
          eppShowName,
          seasonName,
          someBlogValue,
          result,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);
// /:airdate/:epid/:name/:showname/:season
router.post(
  "/:airdate/:epid/:name/:showname/:season/:thisid/edit",
  checkLoggin,
  (req, res, next) => {
    let airDate = req.params.airdate;
    let epId = req.params.epid;
    let eppName = req.params.name;
    let eppShowName = req.params.showname;
    let seasonName = req.params.season;
    let thisBlogId = req.params.thisid;

    const { newComment, newForecastComment } = req.body;
    let editedComment = {
      comment: newComment,
    };

    let editedForcastComment = {
      forecastcomment: newForecastComment,
    };

    if (newComment) {
      BlogModel.findByIdAndUpdate(thisBlogId, editedComment)
        .then(() => {
          res.redirect(
            `/${airDate}/${epId}/${eppName}/${eppShowName}/${seasonName}`
          );
        })
        .catch((err) => {
          next(err);
        });
    } else {
      BlogModel.findByIdAndUpdate(thisBlogId, editedForcastComment)
        .then(() => {
          res.redirect(
            `/${airDate}/${epId}/${eppName}/${eppShowName}/${seasonName}`
          );
        })
        .catch((err) => {
          next(err);
        });
    }
  }
);

module.exports = router;
