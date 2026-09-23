const listingRoutes = require("./routes/listings");
const Listing = require("./models/Listings");
const authRoutes = require("./routes/auth");
const session = require("express-session");
const loadCurrentUser = require("./middleware/auth");

const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

const app = express();

const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "outpost-secret-key",
        resave: false,
        saveUninitialized: false
    })
);
app.use(loadCurrentUser);
app.use("/api/listings", listingRoutes);
app.use("/api/auth", authRoutes);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
});
app.get("/register", (req, res) => {
    res.render("auth/register");
});
app.get("/listings", async (req, res) => {
    try {
        const listings = await Listing.find();

        res.render("listings/index", {
            listings: listings
        });

    } catch (error) {
        console.error(error);

        res.status(500).send("Failed to load listings");
    }
});

app.get("/listings/:id", async (req, res) => {
    try {

        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        res.render("listings/show", {
            listing: listing
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Failed to load listing");

    }
});
app.get("/dashboard", (req, res) => {

    if (!req.session.userId) {
        return res.redirect("/login");
    }

    res.render("dashboard");

});
app.get("/login", (req, res) => {
    res.render("auth/login");
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
