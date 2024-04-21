const Listing=require("../model/listing")
const {listingSchema, reviewSchema} = require("../schema.js")

module.exports.index =(async(req, res)=> {

  try {
    const allListings =await Listing.find({})
    res.render("listings/index", { allListings });
  } catch (error) {
    console.error("error in listing route")
  }
})
module.exports.edit=(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
})
module.exports.update=(async (req, res) => {
  
  const { id } = req.params;
  // Use findByIdAndUpdate to find the listing by ID and update it with the provided data
 
  
 let listing=  await Listing.findByIdAndUpdate(id,{ ...req.body.listing});

 if(typeof req.file !=="undefined"){
    let url = req.file.path;
  let filename= req.file.filename
  listing.image={url, filename}
  await listing.save()
 }

  req.flash("success", "New listing updated!")
  res.redirect("/listings"); // Redirect to the listings page after successful update
} 
)

module.exports.delete=(async(req, res)=>{
  let {id} =req.params;
  let deletedListing = await Listing.findByIdAndDelete(id)
  console.log(deletedListing)
  req.flash("success", "New listing deleted!")
  res.redirect("/listings")
})

module.exports.showlisting=(async(req, res)=> {
  let {id}= req.params;
const listing= await Listing.findById(id).populate({path:"reviews",populate:{
  path:"author",
}}).populate("owner")
if(!listing){
  req.flash("error", "Listing you requested for does not exist")
  req.redirect("/listings")
}

res.render("listings/show.ejs",{listing})
})

module.exports.create=(async(req, res) => {
  let result = listingSchema.validate(req.body)
  console.log(result)
  if (result.error) {
      throw new ExpressError(400, result.error)
  }
  let url = req.file.path;
  let filename= req.file.filename
  console.log(url ,"..",filename)

  const newListing = new Listing(req.body.listing) // This line expects req.body.listing to exist
  newListing.owner =req.user._id
  newListing.image={url, filename}
  await newListing.save() 
  req.flash("success", "New listing created!")
  res.redirect("/listings")
})