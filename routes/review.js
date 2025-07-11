const express=require('express');
const router=express.Router({mergeParams:true});

const Listing=require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const Review=require("../models/reviews");
const ExpressError = require("../utils/ExpressError");
const {reviewSchema} = require("../schema");
const {isLoggedIn, verifyReviewOwner , validateReview } = require('../middleware');
const reviewController=require('../controllers/reviewController');

//Reviews
router.route("/")
//post 
.post(isLoggedIn ,validateReview ,wrapAsync(reviewController.createReview));

router.route("/:reviewId" )
//Delete review route
.delete(isLoggedIn,verifyReviewOwner ,  wrapAsync(reviewController.deleteReview));

module.exports=router;