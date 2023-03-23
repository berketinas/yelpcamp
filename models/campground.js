const mongoose = require('mongoose');

const { Schema } = mongoose;

const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const options = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    location: String,
    images: [ImageSchema],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, options);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
        <b><a href="/campgrounds/${this._id}">${this.title}</a></b>
        <p>${this.description.substr(0, 50)}...</p>
    `;
});

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
