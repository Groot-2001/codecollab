var express = require("express");
var router = express.Router();

router
  .route("/register")
  .get("/register", (req, res, next) => {
    res.render("register");
  })
  .post("register", (req, res, next) => {
    req.checkBody("name", "Invalid name").notEmpty();
    req.checkBody("email", "Invalid email").isEmail();
    req.checkBody("password", "Invalid password").notEmpty();
    req
      .checkBody("password", "passwords do not matched")
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
      let user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.setPassword = req.body.password;
      user.save((err) => {
        if (err) {
          res.render("register", { errorMessages: err });
        } else {
          res.render("/login");
        }
      });
    }
  });

router.get("/login", (req, res, next) => {
  res.render("login");
});
