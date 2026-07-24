const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const axios = require("axios");

main().then(() => {
    console.log("Connected");
}).catch((err) => {
    console.log(err)
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// Delay function
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const initDB = async () => {
    await Listing.deleteMany({});

    for (let listing of initData.data) {

        listing.owner = "6a5a08dc59e6310e0982c8be";

        const location = `${listing.location}, ${listing.country}`;

        try {
            const response = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params: {
                        q: location,
                        format: "json",
                        limit: 1,
                    },
                    headers: {
                        "User-Agent": "WanderLustApp",
                    },
                }
            );

            if (response.data.length > 0) {
                listing.geometry = {
                    type: "Point",
                    coordinates: [
                        parseFloat(response.data[0].lon),
                        parseFloat(response.data[0].lat),
                    ],
                };
            } else {
                console.log(`No coordinates found for ${location}`);
            }

            // Wait 1 second before next request
            await sleep(1000);

        } catch (err) {
            console.log(`Error geocoding ${location}: ${err.message}`);
        }
    }

    await Listing.insertMany(initData.data);
    console.log("Data initialized");
};

initDB();