const User=require('../models/user');

module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signupForm=async(req,res)=>{
    try{
        let signup=req.body.signup;
        let newUser=new User({
        username:signup.username,
        email:signup.email,
    });
    let registeredUser=await User.register(newUser , signup.password);
    console.log(registeredUser);
    req.login(registeredUser , (err)=>{
        if(err){
            return next(err);
        }
         req.flash("success" , "Welcome to Stayin!");
        res.redirect("/listings");
    })
    }
    catch(e){
        req.flash('error' , e.message);
        res.redirect('/signup');
    }
};
module.exports.renderLogin= (req,res)=>{
    res.render("users/login.ejs");
};
module.exports.loginForm=async(req,res)=>{
    req.flash("success","Welcome back to StayIn! You are logged in!");
    if(res.locals.redirectPath){
        return res.redirect(res.locals.redirectPath);
    }
    res.redirect('/listings');
};
module.exports.logoutUser=(req,res , next)=>{//Passport method only [takes a callback for what is gonna happen after logout]
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success" , "You are logged out from the StayIn! Thank you!");
        res.redirect("/listings");
    }) 
};

