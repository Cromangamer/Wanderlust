const express = require("express");
const router = express.Router();
const UserSchema = require("../models/user");
const passport = require("passport");
const { isLoggedin } = require('../models/login.js');
const userController = require("../controller/user");
const user = require("../models/user");

// Middleware to set flash messages in response locals
router.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// User Registration Route
router.route("/signup")
  .get(userController.renderSignupForm)
  .post(userController.signup);

// User Login Route
router.route("/signin")
  .get(userController.renderSigninForm)
  .post(userController.signin);
  
// User Logout Route
router.get("/signout", isLoggedin, userController.signout);

module.exports = router;
