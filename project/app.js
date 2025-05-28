const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require("./models/listing.js")
const path=require("path"); //to connect the ejs file
const wrapAsync=require("./utils/wrapAsync.js");   //for handle the error
const ExpressError = require("./utils/ExpressError.js"); 
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js")
const passport= require("passport");
const localStrategy= require("passport-local");
const user= require("./models/users.js");


// app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views"));

//set-up for databases
//const MONG_URL=("mongodb://127.0.0.1:27017/airanb");
main().then(()=>{
    console.log("Connected to the databases");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airanb");
}



//connect to server
app.listen(8080, ()=>{
    console.log("server is running");
});


//api create
app.get("/",(req,res)=>{
    res.send("working");
});



// app.get("/testListing",async(req,res)=>{
//     let sampleListing= new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location: "Digha, West Bengal",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");

//     res.send("successfully testing");
// })



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


//index route
app.get("/listing", wrapAsync(async (req, res) => {
  const alllistings = await Listing.find({});
  //console.log(alllistings);
  res.render("listing/index", { alllistings });
}));



//new route
app.get("/listing/new",(req,res)=>{
  res.render("listing/new")
})





//show route
app.use(express.urlencoded({extended: true}));
app.get("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listing/show",{listing});
}));




const validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg= error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
}

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};




//create route
app.post("/listing", validateListing, wrapAsync(async (req, res, next) => {
  let result = listingSchema.validate(req.body);
  console.log(result);
  if (result.error) {
    throw new ExpressError(400, result.error);
  }

  const newListing = new Listing(req.body.listing);  // ← fixed this line
  await newListing.save();

  res.redirect("/listing");
}));




//edit route
app.get("/listing/:id/edit", validateListing ,wrapAsync(async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listing/edit",{listing});
}));




const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); 
app.use(express.static(path.join(__dirname,"/public")));   //fro styling


//update route
// app.put("/listing/:id", validateListing, wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   res.redirect(`/listing/${id}`);
// }));

app.put("/listing/:id", validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
  res.redirect(`/listing/${id}`);
}));










//delete route
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  let deltedListing= await Listing.findByIdAndDelete(id);
  console.log(deltedListing);
  res.redirect("/listing");
}));


//review route---> post 
app.post("/listing/:id/reviews", validateReview,wrapAsync(async(req,res)=>{
let listing= await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);

listing.reviews.push(newReview);
await newReview.save();
await listing.save();

console.log("new review saved");
res.redirect(`/listing/${req.params.id}`);
}))


//delete review route of the comment
app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,  {$pull: {reviews: reviewId}})   //delete form the array
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listing/${req.params.id}`);
}))


const ejsMate=require("ejs-mate");
app.engine('ejs',ejsMate);



//middleware
// app.all("*",(req,res,next)=>{
//   next(new ExpressError(404,"Page Not Found"));
// })


app.use((err, req, res, next)=>{
  let {statusCode=500, message="something went wrong!"}= err;
  res.render("error.ejs",{err});
  //res.status(statusCode).send(message);
});




