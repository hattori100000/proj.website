const express = require("express")
const router = express.Router()
const User = require("../model/user-model")
const passport = require("passport")
const { saveRedirectUrl, isLoggedIn } = require("../middleware")
const wrapAsyc= require("../utils/wrapAsyc")
const userController = require("../controllers/users-controller")
const user = require("../model/user-model")


router.route("/signup")
.get( userController.rendersignup)
.post(wrapAsyc(userController.signup)
)
//rendersignup

//signup

router.route("/login")
.get(userController.renderlogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}), userController.login)

//renderlogin form 


//login


//logout
router.get("/logout", userController.logout)



module.exports= router