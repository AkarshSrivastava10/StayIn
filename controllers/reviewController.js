const Listing=require("../models/listing");
const Review=require('../models/reviews');

module.exports.createReview=async(req,res)=>{
    console.log(req.params.id);
    let {id}=req.params;
    let listing=await Listing.findById(id);

    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" , "New review created successfully!");
    
    res.redirect(`/listings/${id}`);
};
module.exports.deleteReview=async(req,res)=>{
    let {id , reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id , {$pull :  {reviews : reviewId}});
    req.flash("success" , "Review Deleted successfully!");
    res.redirect(`/listings/${id}`);
};
