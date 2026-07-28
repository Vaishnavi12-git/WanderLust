require("dotenv").config();
const mongoose = require("mongoose");

async function test() {
    try {
        console.log(process.env.ATLASDB_URL); // should print your Atlas URL

        await mongoose.connect(process.env.ATLASDB_URL);

        console.log("✅ Connected Successfully!");
        console.log("Ready State:", mongoose.connection.readyState);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

test();