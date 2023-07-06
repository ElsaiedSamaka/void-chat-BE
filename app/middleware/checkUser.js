const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const User = require("../models").user;

const getCurrentUser = (req, res, next) => {
  const token = req.cookies.token;
  // const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
      authentication: false,
      username: null,
    });
  } else {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(403).send({
          message: "Unauthorized!",
          authentication: false,
          username: null,
          error: err,
        });
      }
      req.userId = decoded.id;
      next();
    });
  }
};
const isActive = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user.isActive) {
    return res.status(403).json({ message: "User not active" });
  }
  next();
};
const checkUser = {
  getCurrentUser,
  isActive,
};
module.exports = checkUser;
