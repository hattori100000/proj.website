const express = require("express")

const router = express.Router({mergeParams:true})
const wrapAsyc= require("../utils/wrapAsyc.js")
const ExpressError= require("../utils/ExpressError.js")
const {listingSchema, reviewSchema,} = require("../schema.js")
const Listing = require("../model/listing-model.js")

const Review = require("../model/review-model.js")
const { isLoggedIn, isReviewAuthor } = require("../middleware.js")
const reviewController = require("../controllers/reviews-controller.js")

//creatting the schema validatereviews for fnx
const validatReviews = (req, res, next)=> {
  let {error} = reviewSchema.validate(req.body)
 
if(error){
  let errMsg =error.details.map((el) => el.message).join(",")
  throw new ExpressError(400, errMsg)
}else{
  next()
}
}

//REVIEW POST ROUTE
router.post("/",isLoggedIn, validatReviews , wrapAsyc(reviewController.createReview))
 
 //DELETE REVIEW ROUTE
 router.delete("/:reviewId",isLoggedIn, isReviewAuthor,wrapAsyc(reviewController.destroyReview))
 
 
module.exports= router