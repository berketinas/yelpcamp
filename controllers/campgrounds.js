const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNew = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.create = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
    }).send();

    const campground = new Campground(req.body.campground);

    campground.geometry = geoData.body.features[0].geometry;
    campground.author = req.user._id;
    campground.images = req.files.map((file) => ({ url: file.path, filename: file.filename }));

    await campground.save();
    console.log(campground);
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
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

    const imgs = req.files.map((file) => ({ url: file.path, filename: file.filename }));
    campground.images.push(...imgs);

    if (req.body.deleteImages) {
        req.body.deleteImages.forEach((filename) => cloudinary.uploader.destroy(filename));
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }

    console.log(campground);
    campground.save();
    req.flash('success', 'Successfully updated campground.');
    return res.redirect(`/campgrounds/${id}`);
};

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground.');
    res.redirect('/campgrounds');
};
