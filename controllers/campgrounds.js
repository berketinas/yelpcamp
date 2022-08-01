const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNew = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.create = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created new campground.');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
            },
        })
        .populate('author');

    if (!campground) {
        req.flash('error', 'Couldn\'t find campground.');
        return res.redirect('/campgrounds');
    }

    return res.render('campgrounds/detail', { campground });
};

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground) {
        req.flash('error', 'Couldn\'t find campground.');
        return res.redirect('/campgrounds');
    }

    return res.render('campgrounds/edit', { campground });
};

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });

    req.flash('success', 'Successfully updated campground.');
    return res.redirect(`/campgrounds/${id}`);
};

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground.');
    res.redirect('/campgrounds');
};