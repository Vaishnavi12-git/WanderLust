const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { error } = require("console");
const {listingSchema} = require("./schema.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main().then(() => {
    console.log("Connected");
}).catch((err) => {
    console.log(err)
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Villa",
//         description: "By the beach",
//         price: 2000,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Data added");
//     res.send("Listed...");
// });

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else {
        next();
    }
}

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
   const allListings = await Listing.find({});
//    console.log(allListings);
   res.render("listings/index.ejs", {allListings});
}));

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/show.ejs", {listing});
}));


//Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async(req, res) => {
    if(!req.body.listing){
        throw(new ExpressError(400, "Send valid data"));
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.get("/", (req, res) => {
    res.send("Port working");
});

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let{ statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server is on");
});

