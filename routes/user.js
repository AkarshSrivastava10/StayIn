const express=require('express');
const router=express.Router();
const User=require('../models/user');
const ExpressError = require('../utils/ExpressError');
const wrapAsync=require("../utils/wrapAsync");
const passport=require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController=require('../controllers/userController');

router.route("/signup")
//Sign up
.get(userController.renderSignup)
.post(wrapAsync(userController.signupForm));

router.route("/login")
//Log in
.get(userController.renderLogin)
.post(saveRedirectUrl ,passport.authenticate('local' , {failureFlash:true,failureRedirect:'/login'}) , wrapAsync(userController.loginForm));

router.route("/logout")
//Logout
.get(userController.logoutUser);

module.exports=router;

