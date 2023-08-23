//importing some of the dependencies
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressValidator = require("express-validator");
const exSession = require("express-session");
const passport = require("passport");
const hbs = require("hbs");

//importing some utility functions
const config = require("./config");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const taskRouter = require("./routes/task");
const db = require("./db");
require("./passport-config");

//express app instance
const app = express();

//database setup
db();

// view engine setup
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

hbs.registerHelper("isObject", function (object, options) {
  console.log("object:", object);
  if (typeof object === "object") {
    console.log("its an object");
    return options.fn(this);
  } else {
    console.log("not an object");
    return options.inverse(this);
  }
});

//middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(cookieParser());
app.use(
  exSession({
    secret: config.sessionKey,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//auth middleware
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

// Api Endpoints
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/", taskRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
