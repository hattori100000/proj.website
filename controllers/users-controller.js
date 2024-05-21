const User = require("../model/user-model")


module.exports.rendersignup= (req,res)=>{
  res.render("users/signup.ejs")
}

module.exports.signup=async(req,res)=> {
  try {
      let { username, email, password}=req.body
  const newUser = new User({email,username})
 const registerUser= await User.register(newUser, password)
 console.log(registerUser)
 req.login(registerUser, (err)=> {
  if (err) { 
    return next(err)
  }
  req.flash("success", "Welcome")
  res.redirect('/listings');
});

  } catch (error) {
    req.flash("error", e.message)
    res.redirect("/signup")
  }

}

module.exports.renderlogin = (req,res)=>{
  res.render("users/login.ejs")
}
module.exports.login=async(req,res)=>{
  let redirectUrl = res.locals.redirectUrl || "/listings"
  res.redirect(redirectUrl)
}
module.exports.logout = (req,res,next)=>{
  req.logout((err)=>{
    if(err){
     return next(err)
    }
    req.flash("success","you are logged out")
    res.redirect("/listings")
  })
}