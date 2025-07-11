const express=require('express');
const router=express.Router();
const Listing=require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema,reviewSchema} = require("../schema");
const {isLoggedIn, verifyOwner,validateListing}=require('../middleware');
const listingController=require('../controllers/listingController');
const multer  = require('multer');
const {storage}=require('../cloudConfig');
const upload = multer({ storage });

router.route("/")
//index route
.get(wrapAsync(listingController.index))
//create route
.post(isLoggedIn , upload.single('listing[image]') , wrapAsync(listingController.createNewListing));

//new route
router.get("/new" , isLoggedIn , listingController.renderNewFrom);

router.route("/:id")
// show route (individual)
.get(wrapAsync(listingController.renderShowListing))
//edit route
.put(isLoggedIn , validateListing ,upload.single('listing[image]') , wrapAsync(listingController.editListingForm))
//Delete route
.delete(isLoggedIn , verifyOwner ,wrapAsync(listingController.deleteListing));

//edit route
router.route("/:id/edit")
.get(isLoggedIn , verifyOwner ,wrapAsync(listingController.renderEditListing));

module.exports=router;