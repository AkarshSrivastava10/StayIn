const Listing=require('../models/listing');

module.exports.index=async (req,res)=>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs" , {allListings});
};
module.exports.renderNewFrom=(req , res)=>{
    // console.log(req.user); //By default passport create a "user" in req object
    res.render("listings/new.ejs");
};
module.exports.renderShowListing=async (req , res , next)=>{
    try{
        let {id} = req.params;
        let listing = await Listing.findById(id).populate({path : "reviews" , populate : {path:"author"}}).populate("owner");
        // console.log(listing);
        if(!listing) {
            req.flash("error", "The listing doesn't exists");
            res.redirect("/listings");
        }
        
        res.render("listings/show.ejs" , {listing});
    }
    catch(err){
        next(err);
    }   
};
module.exports.createNewListing=async (req,res,next)=>{
    try{
        let newListing = req.body.listing;
        let filename=req.file.filename;
        let url=req.file.path;
        if(!newListing){
            throw new ExpressError(400 , "Some details may not be entered or entered invalid!");
        }
        let listing = new Listing(newListing);
        listing.owner = req.user._id;
        listing.image={url,filename};
        await listing.save();
        req.flash("success" , "New Listing created successfully!");
        res.redirect("/listings");
    }
    catch(err){
        console.log(err);
        next(err);
    }
};
module.exports.renderEditListing=async(req , res)=>{
    let {id} = req.params;
    let singleData = await Listing.findById(id);
    let uploadedImg=singleData.image.url;
    uploadedImg = uploadedImg.replace("/upload" , "/upload/w_250,h_180");
    res.render("listings/edit.ejs" , {singleData , uploadedImg});
};
module.exports.editListingForm=async (req , res,next)=>{
    try{
        let {id} = req.params;
        let updatedListing = await Listing.findByIdAndUpdate(id , {...req.body.listing});
        if(typeof req.file !== "undefined"){
            let url = req.file.path;
            let filename=req.file.filename;
            updatedListing.image={url,filename};
            await updatedListing.save();
        };
        
        req.flash("success" , "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    }
    catch(err){
        next(err);
    }
};
module.exports.deleteListing=async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing deleted successfully!");
    res.redirect("/listings");
};




