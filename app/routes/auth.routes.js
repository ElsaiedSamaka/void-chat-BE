const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/auth.controller");
const { verifySignUp, joiMiddleware } = require("../middleware");
const checkUser = require( "../middleware/checkUser" );
const schemas = require("../validations/schemas");

router.post(
  "/signup",
  [
    verifySignUp.checkDuplicateEmail,
    verifySignUp.checkPasswordConfirmation,
    joiMiddleware(schemas.userSchema, "body"),
  ],
  authController.signup
);
router.post("/signin", [checkUser.isActive], authController.signin);
router.post("/signout", authController.signout);
router.get( "/signedin", [ checkUser.getCurrentUser ], authController.signedin );
module.exports = router