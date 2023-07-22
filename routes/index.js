var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/about", function (req, res, next) {
  res.render("about", { title: "CodeCollab - the code sharing platform" });
});

/* POST Contact page */

router
  .route("/contact")
  .get(function (req, res, next) {
    res.render("contact");
  })
  .post(function (req, res, next) {
    req.checkBody("name", "Empty name").notEmpty();
    req.checkBody("email", "Invalid email").notEmpty();
    req.checkBody("message", "Empty message").notEmpty();

    let errors = req.validationErrors();

    if (errors) {
      res.render("contact", {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        errorMessages: errors,
      });
    } else {
      res.render("thank");
    }
  });

module.exports = router;
