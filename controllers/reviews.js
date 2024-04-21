const Review = require("../model/review");
const Listing = require("../model/listing");

module.exports.createReview = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review created!");

    res.redirect(`/listings/${listing._id}`);
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while creating the review");
    res.redirect("back");
  }
};

module.exports.destroyReview = async (req, res) => {
  try {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while deleting the review");
    res.redirect("back");
  }
};
