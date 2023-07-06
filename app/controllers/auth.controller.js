const User = require("../models").user;
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
const middleware = require( "../middleware/index" );

// signup controller
const signup = async (req, res) => {
  try {
    const user = await User.create({
      email: req.body.email,
      user_img:
        "https://res.cloudinary.com/dwi0qvtbe/image/upload/v1686389748/users/elon_n6r70t.jpg",
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
    });
    const token = createToken(user.id);
    middleware.userLogin.trackUserLogin(user.id);
    res.cookie("token", token, { maxAge: 172800, httpOnly: false });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// signin controller
const signin = async (req, res) => {
  try {
    const existing_user = await User.findOne({
      where: {
        email: req.body.email,
      }
    });
    if (!existing_user) {
      return res.status(401).json({ message: "User Not found." });
    }
    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      existing_user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = createToken(existing_user.id);
    res.cookie("token", token, { maxAge: 172800, httpOnly: false });
    middleware.userLogin.trackUserLogin(existing_user.id);
    res.status(200).json(existing_user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// signedin controller
const signedin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.userId,
      },
    });
    res.send({
      message: `Welcome  ${user.firstname} !)`,
      authentication: true,
      username: user.username,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// signout controller
const signout = async (req, res) => {
  try {
    res.clearCookie("token");
    // res.cookie("token", "", { maxAge: 1, httpOnly: true });
    res.status(200).send({ message: "User signed out successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  signup,
  signin,
  signout,
  signedin,
};