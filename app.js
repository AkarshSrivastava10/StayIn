if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app=express();
const port=8080;
const path=require("path");
const mongoose = require('mongoose');
// const Listing=require("./models/listing");
const ejsMate = require('ejs-mate');
// const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
// const {listingSchema,reviewSchema} = require("./schema");
// const Review=require("./models/reviews");
const User=require("./models/user");
const listingsRouter=require('./routes/listing');
const reviewsRouter=require('./routes/review');
const usersRouter=require('./routes/user');
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');

//DB
const atlasUrl=process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("connected to database successfully!");
})
.catch((err)=>{
    console.log("error connecting to database" + err);
});
async function main(){
    await mongoose.connect(atlasUrl);
}


const store=MongoStore.create({
    mongoUrl:atlasUrl,
    crypto: {
        secret: process.env.SECRET,
    },  
    touchAfter: 24 * 3600,
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true, //prevent cross script attacks
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); //to initialize
app.use(passport.session()); //to connect passport with session

passport.use(new LocalStrategy(User.authenticate())); //to apply local strategy
passport.serializeUser(User.serializeUser()); //To serialize user in current session
passport.deserializeUser(User.deserializeUser()); //To desirealize user after session is finished

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "/views"));

app.use(express.static(path.join(__dirname , "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine('ejs', ejsMate);



// app.get("/testListing" , (req , res)=>{
    //     let listing1=new Listing({
        //         tittle:"Home",
        //         description:"This is about my home",
        //         image:"",
        //         price:1500,
        //         locatoin:"Goa",
        //         country:"India"
        //     });
        
        //     listing1.save()
        //     .then((res)=>{
            //         console.log("listing saved");
            //     })
            //     .catch((err)=>{
                //         console.log("error saving listing" + err);
                //     })
                // })
                
                

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
//Demo user
// app.get("/fakeuser" , async(req,res)=>{
//     let demoUser=new User({
//         email:'demoUser@gmail.com',
//         username:"Demo_User",
//     })
//     let registeredUser=await User.register(demoUser , "helloworld");
//     res.send(registeredUser);
// })

app.get("/" , (req , res)=>{
    res.redirect("/listings");
})

//listing routes
app.use("/listings" , listingsRouter);
//review routes
app.use("/listings/:id/reviews" , reviewsRouter);
//user routes
app.use("/" , usersRouter);



app.get("*" , (req , res , next)=>{
    next(new ExpressError(404 , "Page not found!"));
})

app.use((err , req , res , next)=>{
    let {code = 500 , message="something went wrong!"} = err;
    res.render("error.ejs" , {err});
})


app.listen(port , (req,res)=>{
    console.log(`server is running on port ${port}`);
})