const express = require("express")
const router = express.Router()
const wrapAsyc= require("../utils/wrapAsyc")
const {listingSchema, reviewSchema} = require("../schema.js")
const ExpressError= require("../utils/ExpressError")
const {isLoggedIn,isOwner}=require("../middleware.js")
const Listing = require("../model/listing")
const { populate } = require("../model/user.js")
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage}= require('../cloudConfig.js')
const upload = multer({ storage})



//creatting the schema validatelisting for fnx
const validatListing = (req, res, next)=> {
  let {error} = listingSchema.validate(req.body)
 
if(error){
  let errMsg =error.details.map((el) => el.message).join(",")
  throw new ExpressError(400, errMsg)
}else{
  next()
}
}


router.route("/")
.get(wrapAsyc(listingController.index))
.post( isLoggedIn, upload.single('listing[image]'),validatListing , wrapAsyc(listingController.create))

 

//create new route
router.get("/new",isLoggedIn, async(req,res)=>{
 
 await res.render("listings/new.ejs")
})


router.route("/:id")
.get( wrapAsyc(listingController.showlisting))
.put( isLoggedIn, isOwner,upload.single('listing[image]'),validatListing,wrapAsyc(listingController.update)
)
.delete(isLoggedIn,wrapAsyc(listingController.delete))



//create index route


//show route



// Create new route

//Edit Route
router.get("/:id/edit",isLoggedIn, wrapAsyc(listingController.edit)
)
//update route
// router.put("/listings/:id", async(req, res)=>{
//   let {id}=req.params
//  await Listing.findByIdAndUpdate(id, {...req.body.listing})
//  res.redirect("/listings")

// })

// Update route

//DELETE ROUTTE

module.exports= router;