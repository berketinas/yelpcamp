const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map((item) => item.message).join(', ');
        return next(new ExpressError(msg, 400));
    }

    return next();
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in.');
        return res.redirect('/login');
    }

    return next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission.');
        return res.redirect(`/campgrounds/${id}`);
    }

    return next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { campId, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission.');
        return res.redirect(`/campgrounds/${campId}`);
    }

    return next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((item) => item.message).join(', ');
        return next(new ExpressError(msg, 400));
    }

    return next();
};
