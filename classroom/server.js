const express = require("express");
const app = express();
const port = 3000;
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
// Middleware to parse JSON bodies
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.set("trust proxy", 1); // trust first proxy
app.use(session({
  secret: 'keyboard cat', // replace with a strong secret in production
  resave: false, // don't save session if unmodified
  saveUninitialized: true, // don't create session until something stored
}));
app.use(flash());



app.get("/reqcounter", (req, res) => {
  req.session.views = (req.session.views || 0) + 1; 
  res.send('you have visited this page ' + req.session.views + ' times');
});


// app.use(cookieParser("secreate_key_12345"));
// app.get("/getcookies", (req, res) => {
//   res.cookie("session_id", "abc",{ signed: true });
//   res.cookie("india", "namaste",{ signed: true });
//   res.cookie("username", "john_doe",{ signed: true });
//   res.send("Cookies retrieved successfully!");
// });
// app.get("/greet", (req, res) => {
//   const name = req.signedCookies.username || "Guest";
//   is_logged_in = req.signedCookies.session_id ? true : false;
//   console.log("Is user logged in?", is_logged_in);
//   is_logged_in = req.signedCookies.india ? true : false;
//   console.log("Is user logged in?", is_logged_in);
//   is_logged_in = req.signedCookies.username ? true : false;
//   console.log("Is user logged in?", is_logged_in);
//   res.send(`Hello, ${name}! Welcome back to our site.`);
// });

// app.get("/", (req, res) => {
//   console.dir(req.cookies);
  
//   res.send("Welcome to the Classroom Server!");
// });
// app.use("/user", userRoutes);
// app.use("/post", postRoutes);

// now we are going to use flash messages with session
app.get("/register", (req, res) => {
  let { username = "Guest" } = req.query;
  req.session.username = username;
  req.flash("success", "Successfully registered!");
  res.redirect("/hello");
});


app.get("/hello", (req, res) => {
  res.render("hello.ejs", { title: req.session.username || "Guest" });
});

app.get("/flash", (req, res) => {
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash("info", "Flash Message Added");
  res.redirect("/showflash");
});

app.get("/showflash", (req, res) => {
  // Get an array of flash messages by passing the key to req.flash()
  const flashMessages = req.flash("info");
  res.send(flashMessages);
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// 36IB6khIbyzF9tsPtYJgMx3emZl_2Z6tt1fDP6gST583cPxLX
