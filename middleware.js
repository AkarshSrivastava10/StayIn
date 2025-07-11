const Listing=require('./models/listing');
const Review=require('./models/reviews');
const {listingSchema,reviewSchema} = require('./schema');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirectUrl->save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectPath=req.session.redirectUrl;
    }
    next();
}

module.exports.verifyOwner=async(req,res,next)=>{
    let {id} = req.params;
    let verifyListingUser=await Listing.findById(id);
    if(!res.locals.currUser || !verifyListingUser.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not authorized to make changes on this!");
        return res.redirect(`/listings/${id}`);
    }
    next();
} 
module.exports.verifyReviewOwner=async(req,res,next)=>{
    let {id} = req.params;
    let {reviewId}=req.params;
    let verifyReviewUser=await Review.findById(reviewId);
    if(!res.locals.currUser || !verifyReviewUser.author._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not authorized to make changes on this!");
        return res.redirect(`/listings/${id}`);
    }
    next();
} 
module.exports.validateListing = (req , res , next)=>{ //Validate listing middleware
    let result = listingSchema.validate(req.body);
    if(result.err){
        throw new ExpressError(400 , result.err);
    }
    else{
        next();
    }
}
module.exports.validateReview = (req , res , next)=>{ //Validate listing middleware
    let result = reviewSchema.validate(req.body);
    if(result.err){
        throw new ExpressError(400 , result.err);
    }
    else{
        next();
    }
}