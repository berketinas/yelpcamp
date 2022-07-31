const express = require('express');
const asyncWrapper = require('../utils/asyncWrapper');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../middleware');
const { campgroundSchema } = require('../schemas');
const Campground = require('../models/campground');

const router = express.Router();

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((item) => item.message).join(', ');
        return next(new ExpressError(msg, 400));
    }

    return next();
};

router.get('/', asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.post('/', isLoggedIn, validateCampground, asyncWrapper(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created new campground.');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'Couldn\'t find campground.');
        return res.redirect('/campgrounds');
    }

    return res.render('campgrounds/detail', { campground });
}));

router.put('/:id', isLoggedIn, asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground.');
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', isLoggedIn, asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground.');
    res.redirect('/campgrounds');
}));

router.get('/:id/edit', isLoggedIn, asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground) {
        req.flash('error', 'Couldn\'t find campground.');
        return res.redirect('/campgrounds');
    }

    return res.render('campgrounds/edit', { campground });
}));

module.exports = router;
