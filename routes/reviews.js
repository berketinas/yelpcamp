const express = require('express');
const asyncWrapper = require('../utils/asyncWrapper');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { validateReview } = require('../middleware');

const router = express.Router({ mergeParams: true });

router.post('/', validateReview, asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.campId);
    const review = new Review(req.body.review);

    campground.reviews.push(review);

    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created new review.');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', asyncWrapper(async (req, res) => {
    const { campId, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(campId, { $pull: { reviews: reviewId } });
    req.flash('success', 'Successfully deleted review.');
    res.redirect(`/campgrounds/${campId}`);
}));

module.exports = router;
