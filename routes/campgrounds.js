const express = require('express');
const asyncWrapper = require('../utils/asyncWrapper');
const ExpressError = require('../utils/ExpressError');
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

router.post('/', validateCampground, asyncWrapper(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/detail', { campground });
}));

router.put('/:id', asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

router.get('/:id/edit', asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}));

module.exports = router;
