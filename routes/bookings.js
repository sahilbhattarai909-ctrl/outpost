const express = require("express");
const Booking = require("../models/Booking");
const Listing = require("../models/Listings");
const { requireLogin } = require("../middleware/auth");

const router = express.Router();

router.post("/create/:listingId", requireLogin, async (req, res) => {
    try {
        const { date, guests } = req.body;

        const listing = await Listing.findById(req.params.listingId);

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        const totalPrice = listing.price * Number(guests);

        const booking = new Booking({
            user: req.session.userId,
            listing: listing._id,
            date: date,
            guests: guests,
            totalPrice: totalPrice
        });

        await booking.save();

        res.redirect("/bookings");

    } catch (error) {
        console.error(error);
        res.status(500).send("Booking failed");
    }
});

router.get("/", requireLogin, async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.session.userId
        }).populate("listing");

        res.render("bookings/index", {
            bookings: bookings
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load bookings");
    }
});

module.exports = router;
