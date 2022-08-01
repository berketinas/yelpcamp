const mongoose = require('mongoose');

const { Schema } = mongoose;

const Review = require('./review');

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [
        {
            url: String,
            filename: String,
        },
    ],
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
});

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
