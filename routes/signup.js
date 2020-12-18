// Lähteinen Juha 2020

var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("signup", {
    title: "Twitter 2.0 | Sign up"
  });
});

module.exports = router;
