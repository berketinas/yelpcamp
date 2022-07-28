const express = require('express');
const asyncWrapper = require('../utils/asyncWrapper');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas');
const Campground = require('../models/campground');
const Review = require('../models/review');

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((item) => item.message).join(', ');
        return next(new ExpressError(msg, 400));
    }

    return next();
};

router.post('/', validateReview, asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.campId);
    const review = new Review(req.body.review);

    campground.reviews.push(review);

    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', asyncWrapper(async (req, res) => {
    const { campId, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(campId, { $pull: { reviews: reviewId } });
    res.redirect(`/campgrounds/${campId}`);
}));

module.exports = router;
