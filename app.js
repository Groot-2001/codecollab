//importing some of the dependencies
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressValidator = require("express-validator");
const exSession = require("express-session");
const passport = require("passport");

//couple of imports
const config = require("./config");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const db = require("./db");
require("./passport-config");

//express app instance
const app = express();

//database setup
db();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressValidator());
app.use(
  exSession({
    secret: config.sessionKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Api Endpoints
app.use("/", indexRouter);
app.use("/", authRouter);

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
