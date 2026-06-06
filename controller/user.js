const user = require("../models/user");
const passport = require("passport");
const UserSchema = require("../models/user");


module.exports.renderSignupForm = (req, res) => {
  res.render("user/signup.ejs", { title: "Sign-UP" });
};

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new UserSchema({ username, email });
    const registeredUser = await UserSchema.register(newUser, password);

    // Log the user in immediately after registration
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Registration successful! You can now log in.");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/user/signup");
  }
};

module.exports.renderSigninForm = (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.render("user/signin.ejs", { title: "Sign-In" });
};

module.exports.signin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    // ❌ Login failed
    if (!user) {
      req.flash("error", info.message || "Invalid credentials");

      // 🔥 Use 303 redirect (important)
      return res.redirect(303, "/user/signin");
    }

    // ✅ Login success
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome back!");
      let redirectUrl = req.session.redirectUrl || "/listings";
      delete req.session.redirectUrl;
      console.log("Redirecting to:", redirectUrl);
      return res.redirect(303, redirectUrl);
    });
  })(req, res, next);
}

module.exports.signout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      req.flash("error", "Error logging out. Please try again.");
      return res.redirect("/listings");
    }
    req.flash("success", "You have been logged out.");
    res.redirect("/listings");
  });
};