const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const{storage} = require("../cloud-Config.js");
const upload = multer({ storage });

router
    .route("/")
    .get( wrapAsync(listingController.index))
    .post(
        (req, res, next) => {
            console.log("🔥 POST /listings REACHED");
            console.log("🔥 FILE:", req.file);
            next();
        },
        isLoggedIn, 
        upload.single("listing[image]"),
        validateListing, 
        wrapAsync(listingController.createNewListing)
);

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put( isLoggedIn , upload.single("listing[image]"), validateListing, isOwner, wrapAsync(listingController.updateListing))
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)
);

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;