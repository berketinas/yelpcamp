const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');

const ExpressError = require('./utils/ExpressError');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

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

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:campId/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.redirect('/campgrounds');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// eslint-disable-next-line
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something went wrong.';
    res.status(status).render('error', { err });
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});
