var express = require("express");
const passport = require("passport");
const User = require("../models/users");
var router = express.Router();

router
  .route("/register")
  .get((req, res, next) => {
    res.render("register");
  })
  .post(async (req, res, next) => {
    /** basic validation handled with express-validator */
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

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

router.get("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    res.redirect("/"); //Inside a callback… bulletproof!
  });
});

router.get("/dashboard", (req, res, next) => {
  const userinfo = {
    name: req.session.passport.user.displayName,
    id: req.session.passport.user.id,
  };

  res.render("dashboard", {
    user: userinfo,
  });
});

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    authType: "reauthenticate",
    scope: ["public_profile", "email"],
  })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

module.exports = router;
