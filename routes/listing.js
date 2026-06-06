if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError");
const { isLoggedin } = require("../models/login.js");
const listingcontroller = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const uploadCloud = multer({ storage });

const validateListing = (req, res, next) => {
  console.log("Validating listing data:", req.body); // Debugging log
  console.log("re.file:", req.file); // Debugging log for file upload

  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

//Index Route
router.get("", listingcontroller.index);

//New Route
router.get("/new", isLoggedin, listingcontroller.newlisting);

//Show Route
router.get("/:id", listingcontroller.showlisting);

//Create Route
router.post("", uploadCloud.single("listing[image]"), validateListing,  listingcontroller.createlisting);

//Edit Route
router.get("/:id/edit", isLoggedin, listingcontroller.editlisting);

//Update Route
router.put("/:id", validateListing, uploadCloud.single("listing[image]"), listingcontroller.updatelisting);

//Delete Route
router.delete("/:id", isLoggedin, listingcontroller.deletelisting);


module.exports = router;
