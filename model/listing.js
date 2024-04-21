const mongoose= require("mongoose")
const { Schema, model } = require('mongoose');
const review= require("./review");
const { ref } = require("joi");

const listingSchema = new mongoose.Schema({
  title:String,
  description: String,
  image: {
    url:String,
    filename:String,
   },
    price: Number,
    location: String,
    country: String,


    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref:"Review",
      },
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    }
    
  

})

listingSchema.post("findOneAndDelete", async(listing)=> {
  if(listing){
     await review.deleteMany({ _id:{$in:listing.reviews}})
  }
 

})


const Listing = new mongoose.model("Listing", listingSchema)

module.exports= Listing
