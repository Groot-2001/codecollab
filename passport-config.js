const passport = require("passport");
const User = require("./models/users");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return done(new Error("user not found"));
    }
    console.log(user);
    done(null, user);
  } catch (e) {
    done(e);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
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
      } catch (error) {
        console.error(error);
      }
    }
  )
);
