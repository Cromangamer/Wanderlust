module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {

    // save the page user tried to access
    req.session.redirectUrl = req.originalUrl;
    console.log(req.session.redirectUrl);
    
    req.flash("error", "You must be logged in first!");
    return res.redirect("/user/signin");
    
  }

  next();
};