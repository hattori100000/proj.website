const express = require("express");
const router = express.Router();
const wrapAsyc = require("../utils/wrapAsyc");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isOwner } = require("../middleware.js");
const Listing = require("../model/listing");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Validating listing schema
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Routes
router.route("/")
  .get(wrapAsyc(listingController.index))
  .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsyc(listingController.create));

router.get("/new", isLoggedIn, async (req, res) => {
  await res.render("listings/new.ejs", { currUser: req.user });
});

router.route("/:id")
  .get(wrapAsyc(listingController.showlisting))
  .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateL


// Update route

//DELETE ROUTTE

module.exports= router;
