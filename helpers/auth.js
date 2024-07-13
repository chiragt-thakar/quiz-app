const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const userModel = require("../models/user");
const configuration = require("../config/index");
const passport = require("passport");
const {
  ResourceNotFoundError,
  AuthorizationError,
} = require("../errors/common");
//passport jwt strategy to verify bearer token
module.exports.auth = function (app) {
  passport.initialize(app);
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: configuration.jwtSecret.secret,
      },
        async function (jwtPayload, cb) {
          console.log(jwtPayload)
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return await userModel
          .findById(jwtPayload.id)
          .then((user) => {
            return cb(null, user);
          })
          .catch((err) => {
            return cb(err);
          });
      }
    )
  );
};

module.exports.checkAuth = function (req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    try {
    //   if (!user) {
    //     throw new AuthorizationError("Invalid Token");
        //   }
        console.log(user.role,"role")
        console.log(req.get('host'),"host")
        console.log(req.originalUrl,"orignalurl")

      if (err) {
        throw new ResourceNotFoundError(err);
      }
      req.user = user;
    } catch (error) {
      next(error);
    }
    next();
  })(req, res, next);
};
