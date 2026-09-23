const User = require("../models/User");

const loadCurrentUser = async (req, res, next) => {

    try {

        if (!req.session.userId) {
            res.locals.currentUser = null;
            return next();
        }

        const user = await User.findById(req.session.userId);

        res.locals.currentUser = user;

        next();

    } catch (error) {

        console.error(error);

        res.locals.currentUser = null;

        next();

    }

};

const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    next();
};

module.exports = loadCurrentUser;
module.exports.requireLogin = requireLogin;
