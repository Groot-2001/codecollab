var express = require("express");
const User = require("../models/users");
var router = express.Router();

router
  .route("/register")
  .get((req, res, next) => {
    res.render("register");
  })
  .post(async (req, res, next) => {
    req.checkBody("username", "Invalid name").notEmpty();
    req.checkBody("email", "Invalid email").isEmail();
    req.checkBody("password", "Invalid password").notEmpty();
    req
      .checkBody("confirmPassword", "passwords do not matched")
      .equals(req.body.confirmPassword)
      .notEmpty();
    let errors = req.validationErrors();

    if (errors) {
      res.render("register", {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        errorMessages: errors,
      });
    } else {
      try {
        const user = new User({
          name: req.body.username,
          email: req.body.email,
        });
        user.setPassword(req.body.password);
        await user.save();
        res.render("login");
      } catch (error) {
        if (error) {
          console.log(error);
          res.render("register", { errorMessages: error });
        }
        return res.status(500).json({
          message: "Internal Server Error!",
          error,
        });
      }
    }
  });

router.get("/login", (req, res, next) => {
  res.render("login");
});

module.exports = router;
