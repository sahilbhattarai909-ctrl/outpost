const express = require("express");
const Listing = require("../models/Listings");

const router = express.Router();


// GET all listings
router.get("/", async (req, res) => {
    try {

        const { search } = req.query;

        let filter = {};

        if (search) {
            filter = {
                $or: [
                    {
                        title: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        location: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        category: {
                            $regex: search,
                            $options: "i"
                        }
                    }
                ]
            };
        }

        const listings = await Listing.find(filter);

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
router.put("/:id", async (req, res) => {
    try {

        const listing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!listing) {
            return res.status(404).json({
                message: "Listing not found"
            });
        }

        res.json(listing);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});


router.delete("/:id", async (req, res) => {
    try {

        const listing = await Listing.findByIdAndDelete(
            req.params.id
        );

        if (!listing) {
            return res.status(404).json({
                message: "Listing not found"
            });
        }

        res.json({
            message: "Listing deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete listing"
        });

    }
});

module.exports = router;
