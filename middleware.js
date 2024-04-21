const Listing=  require("./model/listing")
const Review= require("./model/review")


module.exports.isLoggedIn =(req, res,next)=>{
  console.log(req.path,"..", req.originalUrl)
  if(!req.isAuthenticated()){
    
    req.session.redirectUrl = req.originalUrl
    req.flash("error", "you must be logged in to create listing!")
    return res.redirect("/login")
      }
      next()
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl
  }
  next()
}


module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id); // Wait for the Promise to resolve
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    
    if (!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You don't have permission to edit this listing");
      return res.redirect(`/listings/${id}`);
    }
    
    next();
  } catch (error) {
    console.error("Error in isOwner middleware:", error);
    req.flash("error", "Something went wrong");
   return res.redirect("/listings");
  }
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId); // Corrected: findById(reviewId)
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the owner ");
    return res.redirect("/listings");
  }
  next();
}

