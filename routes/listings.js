const express = require("express");
const Listing = require("../models/Listings");

const router = express.Router();


// GET all listings
router.get("/", async (req, res) => {

    try {

        const listings = await Listing.find();

        res.json(listings);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch listings"
        });

    }

});


// GET one listing
router.get("/:id", async (req, res) => {

    try {

        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({
                message: "Listing not found"
            });
        }

        res.json(listing);

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

});


// CREATE listing
router.post("/", async (req, res) => {

    try {

        const listing = new Listing(req.body);

        const savedListing = await listing.save();

        res.status(201).json(savedListing);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});


module.exports = router;
