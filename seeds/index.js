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
            geometry: {
                type: 'Point',
                coordinates: [cities[randomThou].longitude, cities[randomThou].latitude],
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/db5hfehag/image/upload/v1659351344/YelpCamp/tl22kxtntfxlbtnovqe6.jpg',
                    filename: 'YelpCamp/tl22kxtntfxlbtnovqe6',
                },
                {
                    url: 'https://res.cloudinary.com/db5hfehag/image/upload/v1659351344/YelpCamp/nb4mwdo9pachcfjlajfk.jpg',
                    filename: 'YelpCamp/nb4mwdo9pachcfjlajfk',
                },
                {
                    url: 'https://res.cloudinary.com/db5hfehag/image/upload/v1659351344/YelpCamp/nkbcwjz55cqdgdg2jioi.jpg',
                    filename: 'YelpCamp/nkbcwjz55cqdgdg2jioi',
                },
            ],
            // eslint-disable-next-line
            description: 'Aliquam eget volutpat dui. Phasellus at libero sollicitudin ex semper maximus. Maecenas justo augue, hendrerit lacinia erat nec, egestas rutrum ante. Phasellus in bibendum nunc, a viverra massa.',
            price: Math.floor(Math.random() * 50) + 10,
            author: '62e5634684c529fdc7c50756',
        });
        await camp.save();
    }
};

seedDB()
    .then(() => mongoose.connection.close());
