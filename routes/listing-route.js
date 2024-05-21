const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const Listing = require("../model/listing-model.js");
const listingController = require("../controllers/listings-controller.js");
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

// creating the schema validateListing function
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.create));

// create new route
router.get("/new", isLoggedIn, async (req, res) => {
  await res.render("listings/new.ejs");
});

router.route("/:id")
  .get(wrapAsync(listingController.showlisting))
  .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.update))
  .delete(isLoggedIn, wrapAsync(listingController.delete));

router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.edit));

module.exports = router;
