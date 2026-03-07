const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing.js");

main().then(() => {
    console.log("Connected");
}).catch((err) => {
    console.log(err)
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "Villa",
        description: "By the beach",
        price: 2000,
        location: "Calangute, Goa",
        country: "India",
    });

    await sampleListing.save();
    console.log("Data added");
    res.send("Listed...");
});

app.get("/", (req, res) => {
    res.send("Port working");
});

app.listen(8080, () => {
    console.log("Server is on");
});

