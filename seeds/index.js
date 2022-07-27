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
            image: 'https://source.unsplash.com/collection/483251',
            // eslint-disable-next-line
            description: 'Aliquam eget volutpat dui. Phasellus at libero sollicitudin ex semper maximus. Maecenas justo augue, hendrerit lacinia erat nec, egestas rutrum ante. Phasellus in bibendum nunc, a viverra massa. Sed et congue nulla. Donec volutpat iaculis ipsum nec sollicitudin. Aenean interdum eros eu dolor dapibus ultrices. Donec congue lobortis eros, sed euismod tortor. Cras porta accumsan erat, vitae sodales ipsum pellentesque id. Cras laoreet sagittis facilisis. Curabitur venenatis purus in leo ullamcorper pellentesque. Phasellus ac metus lacinia, consequat mauris dictum, porta tortor. Sed pharetra sodales pellentesque.',
            price: Math.floor(Math.random() * 50) + 10,
        });
        await camp.save();
    }
};

seedDB()
    .then(() => mongoose.connection.close());
