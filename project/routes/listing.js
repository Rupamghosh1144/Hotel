// const express=require("express");
// const router=express.Router();


// //index route
// router.get("/listing", wrapAsync(async (req, res) => {
//   const alllistings = await Listing.find({});
//   //console.log(alllistings);
//   res.render("listing/index", { alllistings });
// }));



// //new route
// router.get("/listing/new",(req,res)=>{
//   res.render("listing/new")
// })



// //show route
// router.use(express.urlencoded({extended: true}));
// router.get("/listing/:id",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id).populate("reviews");
//     res.render("listing/show",{listing});
// }));


// //create route
// router.post("/listing", validateListing, wrapAsync(async (req, res, next) => {
//   let result = listingSchema.validate(req.body);
//   console.log(result);
//   if (result.error) {
//     throw new ExpressError(400, result.error);
//   }

//   const newListing = new Listing(req.body.listing);  // ← fixed this line
//   await newListing.save();

//   res.redirect("/listing");
// }));




// //update route
// router.put("/listing/:id", validateListing, wrapAsync(async (req, res) => {
//   const { id } = req.params;
//   const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
//   res.redirect(`/listing/${id}`);
// }));

// //delete route
// router.delete("/listing/:id",wrapAsync(async(req,res)=>{
//   let {id}=req.params;
//   let deltedListing= await Listing.findByIdAndDelete(id);
//   console.log(deltedListing);
//   res.redirect("/listing");
// }));

// module.exports = router;