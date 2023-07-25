var express = require("express");
var router = express.Router();
let nodemailer = require("nodemailer");
const config = require("../config");
let transporter = nodemailer.createTransport(config.mailer);
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
      const mailOptions = {
        from: "CodeCollab <no-reply@CodeCollab.com",
        to: "demo.codecollab@gmail.com",
        subject: "You got new message from visitor",
        text: req.body.message,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          return;
        }
        res.render("thank");
      });
    }
  });

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

module.exports = router;
