import jwt from "jsonwebtoken";
import passport from "passport";
import { appConfig } from "../config/env.config.js";

export const generateToken = (user) => {
  let token = jwt.sign(user, appConfig.jwtSecret, { expiresIn: "50m" });
  return token;
};

export const verifyToken = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
        next(err)
    }
    req.user = user;
    next();
  })(req,res,next);
};

