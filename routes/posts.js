// Lähteinen Juha 2020

// Required libraries
var express = require("express");
var router = express.Router();

var userLoggedIn;

// Good validation documentation available at https://express-validator.github.io/docs/
const { sanitizeBody } = require("express-validator");

// get posts listing
router.get("/", function (req, res, next) {
  // retrieving the posts from the global var
  var data = req.app.get("poststore");

  // just send the array of objects to the browser
  res.render("posts", {
    title: "Twitter 2.0 | Posts",
    postlist: data
  });
});

////////////////////////////////////////////////////////////////////////////////
// Signing up for new user

router.post("/signup", sanitizeBody("*").trim().escape(), function (
  req,
  res,
  next
) {
  var user_local = req.body.signUpUser;
  var password_local = req.body.signUpPassword;

  // Checks if required fields are filled and renders to index.pug to log in. Otherwise asks to retry
  if (user_local && password_local !== "") {
    console.log("New user: " + user_local + " has signed up.");
    req.app.get("userstore").push({
      user: user_local,
      pw: password_local
    });
    res.redirect("/");
  } else {
    console.log("All the required fields were not filled. Please try again.");
    res.redirect("/signup");
  }
});

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Logging in to post some great content

router.post("/login", sanitizeBody("*").trim().escape(), function (
  req,
  res,
  next
) {
  var users = req.app.get("userstore");
  var user_local = req.body.loginuser;
  var password_local = req.body.loginpassword;
  var userFound = 0;

  // Checks if user(s) exist(s)
  for (var i = 0; i < users.length; i++) {
    console.log(users[i].user); // just an extra print
    if (users[i].user === user_local) {
      if (users[i].pw === password_local) {
        userLoggedIn = users[i].user;
        userFound++;
      }
    }
  }

  // If user doesn't exist renders to index.pug. Otherwise renders to posts.pug
  if (userFound === 0) {
    console.log("An error occured. Please try again.");
    res.redirect("/");
  } else {
    res.redirect("/posts");
    console.log(user_local + " has logged in.");
  }
});

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Sanitation middleware
// See https://express-validator.github.io/docs/sanitization-chain-api.html
// And https://express-validator.github.io/docs/filter-api.html

// Creating new post and adding a timestamp for it
router.post("/create", sanitizeBody("*").trim().escape(), function (
  req,
  res,
  next
) {
  var content_local = req.body.content;
  var author_local = userLoggedIn;
  var date = new Date();
  var hour = date.getHours() + 2; // +2 for Finnish winter time zone (UTC+2)
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  var hour_m = String(hour);
  if (hour_m === "24") {
    hour = "00";
  }
  if (hour_m === "25") {
    hour = "01";
  }

  var minute_m = String(minute);
  if (minute_m.length === 1) {
    minute = "0" + minute_m;
  }

  var second_m = String(second);
  if (second_m.length === 1) {
    second = "0" + second_m;
  }

  var time = hour + ":" + minute;
  var postDate = day + "." + month + "." + year;

  // Checks if the amount of characters is valid and if so
  // --> creates a post and refreshes the page
  if (content_local.length > 0 && content_local.length <= 280) {
    req.app.get("poststore").unshift({
      author: author_local,
      content: content_local,
      time: time,
      date: postDate
    });
    console.log("Some content has been posted: " + content_local);
    console.log("By the great author: " + author_local);
    console.log("Time: " + time, postDate);
    console.log("The post has been successfully sent!");
    res.redirect("/posts");
  } else {
    console.log("An error occured. Please check what happened.");
  }
});

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Logging out and rendering back to home page (index.pug)
router.post("/logout", sanitizeBody("*").trim().escape(), function (
  req,
  res,
  next
) {
  res.redirect("/");
});

////////////////////////////////////////////////////////////////////////////////

module.exports = router;
