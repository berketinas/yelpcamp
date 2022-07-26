const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect(
    'mongodb://localhost:27017/yelp-camp',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('connection successful');
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomThou = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[randomThou].city}, ${cities[randomThou].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
        });
        await camp.save();
    }
};

seedDB()
    .then(() => mongoose.connection.close());
