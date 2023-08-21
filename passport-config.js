const passport = require("passport");
const config = require("./config");
const User = require("./models/users");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

const verifyLocal = async (email, password, done) => {
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
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    verifyLocal
  )
);

const verifyCallback = async (accessToken, refreshToken, profile, cb) => {
  const user = await User.findOne({ facebookId: profile.id });
  if (!user) {
    console.log("Adding new user to DB");
    const user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      facebookId: profile.id,
    });
    await user.save();
    return cb(null, profile);
  } else {
    console.log("This User is Already exists");
    return cb(null, profile);
  }
};

passport.use(
  new FacebookStrategy(
    {
      clientID: config.app_id,
      clientSecret: config.app_secret,
      callbackURL: config.app_callbackUrl,
      profileFields: ["id", "displayName", "emails"],
      enableProof: true,
    },
    verifyCallback
  )
);
