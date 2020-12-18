// Lähteinen Juha 2020

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // Retrieving the posts from the global var
  var postlist = req.app.get("poststore");

  res.render("index", {
    title: "Twitter 2.0 | Home",
    postlist: postlist
  });
});

router.post("/getin", function (req, res, next) {
  res.redirect("/signup");
});

module.exports = router;
