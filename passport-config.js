const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ _id: id }, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (username, password, done) => {
      User.findOne({ email: username }, (err, done) => {
        if (err) return done(err);
        if (!user) {
          return done(null, false, {
            message: "username or password is Invalid",
          });
        }
        if (!user.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }
        return done(null, user);
      });
    }
  )
);
