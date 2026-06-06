const dotenv = require("dotenv");
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
// main.js (fixed)
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MONGO_URL = process.env.MONGODB_URI ;
const ExpressError = require("./utils/ExpressError");
const port = 8080;
const listingRoutes = require("./routes/listing.js");
const session = require("express-session");
const flash = require("connect-flash");
const UserSchema = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const userRoutes = require("./routes/user.js");
const User = require("./models/user");

// --------------------------------
// database connection
// --------------------------------
main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}


// --------------------------------
// app configuration
// --------------------------------
app.set("trust proxy", true); // so req.protocol is correct behind ngrok

// Provide a baseUrl for templates (works with both localhost and ngrok)
app.use((req, res, next) => {
  res.locals.baseUrl = `${req.protocol}://${req.get("host")}`;
  next();
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Serve static folder (recommended)
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));

// --------------------------------
// session and flash configuration
// --------------------------------
const sessionConfig = {
  secret: "cromanbraine",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true, // Uncomment if using HTTPS
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
};
// --------------------------------
// passport configuration
// --------------------------------
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(UserSchema.authenticate()));
passport.serializeUser(UserSchema.serializeUser());
passport.deserializeUser(UserSchema.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.currentUser = req.user;
  res.locals.isLoggedIn = req.isAuthenticated();
  res.locals.redirectUrl = req.session.redirectUrl;
  next();
});
// --------------------------------
// routes
// --------------------------------
app.use("/listings", listingRoutes);
app.use("/user", userRoutes);

// Root Route
app.get("/", (req, res) => {
  req.flash("success", "Welcome to Wanderlust Listings!");
  res.render("listings/intro.ejs", { title: "Wanderlust" });
});

// --------------------------------
// error handling middleware
// (must come AFTER all routes)
// --------------------------------

// catch-all for unknown routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Wrong URL Accessed"));
});

// final error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).render("helps/error.ejs", {
    title: "Error",
    status: statusCode,
    message,
  });
});

// --------------------------------
// server listening
// --------------------------------
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
