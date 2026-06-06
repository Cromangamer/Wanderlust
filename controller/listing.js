const Listing = require("../models/listing");




module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", {
    title: "All Listings",
    allListings,
    msg: req.flash("success"),
  });
};

module.exports.showlisting = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).catch((err) => {
    next(new ExpressError(400, "Invalid Listing ID"));
  });
  if (!listing) {
    return next(new ExpressError(404, "Listing Not Found"));
  }
  res.render("listings/show.ejs", { title: "Your List", listing , msg: req.flash("msg")});
};

module.exports.newlisting = (req, res) => {
  console.log(req.user._id);// new ObjectId("69c04f8d03994bb92df275e2")
  res.render("listings/new.ejs", { title: "Create New List", owner: req.user._id });
};

module.exports.createlisting = async (req, res) => {

  const newListing = new Listing(req.body.listing);

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  newListing.owner = req.user._id;

  await newListing.save();

  res.redirect("/listings");
}

module.exports.editlisting = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash("msg", "You don't have permission to edit this listing!");
    return res.redirect(`/listings/${id}`);
  }
  res.set("Cache-Control", "no-store"); // to prevent caching of the edit page
  res.render("listings/edit.ejs", { title: "Edit Your List", listing , owner: req.user._id});
};

module.exports.updatelisting = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
};


module.exports.deletelisting = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findById(id);
  if (!deletedListing.owner.equals(req.user._id)) {
    req.flash("msg", "You don't have permission to edit this listing!");
    return res.redirect(`/listings/${id}`);
  }
  await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");

};