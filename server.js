require('dotenv').config()
const express = require("express")
const app= express()
const port= process.env.PORT || 5000
const connectdb= require("./db/connect")
const path = require("path")
const mehodOverride=require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError= require("./utils/ExpressError")
const session =require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const listingsrouter = require("./routes/listing.js")
const reviewsrouter = require("./routes/reviews.js")
const userrouter = require("./routes/user.js")
const passport = require("passport")
const User= require("./model/user.js")
const LocalStrategy= require("passport-local")
const { MongoClient } = require('mongodb');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(mehodOverride("_method"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const URL = "mongodb+srv://clownlaugh100:thapa@cluster0.pbwu43f.mongodb.net/duplicate?retryWrites=true&w=majority&appName=Cluster0"


const store = MongoStore.create({
  mongoUrl:URL,
  crypto: {
    secret:process.env.SECRET,
  }
  ,
  
touchAfter:24*3600 ,
  
})
store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err)
})

const sessionOptions ={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24*60*60*1000,
    maxAge:7 * 24*60*60*1000,
    httpOnly:true,
  }
}



app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error= req.flash("error")
  res.locals.currUser= req.user
  next()
})

// app.use("/demo",async(req,res)=>{
//   let fakeUser= new User({
//     email:"hello@gmail.com",
//     username:"hello",
//   })
//   let Registeruser =  await User.register(fakeUser,"helloworld")
//   res.send(Registeruser)
// })


app.use("/listings", listingsrouter)
app.use("/listings/:id/reviews", reviewsrouter)
app.use("/", userrouter)
// app.get("/listings", async(req, res)=>{
//   Listing.find({}).then((res)=>{
//     console.log(res)
//   })
// })


app.use((err, req, res, next)=>{
  let {statusCode =404, message="something went wrong "}= err;

res.status(statusCode).render("error.ejs",{message})
  // res.status(statusCode).send(message)

})

// app.use("*",(req, res, next)=> {
//   next(new ExpressError("404", "page not found"))
// } )


connectdb().then(()=> {
  app.listen(port, ()=> {
  console.log(`connected sucessfully on port no ${port}`)
})
})
