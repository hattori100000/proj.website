const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsyc = require("../utils/wrapAsyc");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema.js");
const Review = require("../model/review.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Validating review schema
const validateReviews = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Routes
router.post("/", isLoggedIn, validateReviews, wrapAsyc(reviewController.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsyc(reviewController.destroyReview));

module.exports = router;
