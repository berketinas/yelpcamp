if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const ExpressError = require('./utils/ExpressError');

const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// const dbUrl = 'mongodb://localhost:27017/yelp-camp';
const dbUrl = process.env.DB_URL;

// const secret = 'secret';
const secret = process.env.SECRET;

mongoose.connect(
    dbUrl,
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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(mongoSanitize());

const storeOptions = {
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    },
};

const sessionConfig = {
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: MongoStore.create(storeOptions),
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptUrls = [
    'https://stackpath.bootstrapcdn.com/',
    'https://api.tiles.mapbox.com/',
    'https://api.mapbox.com/',
    'https://cdnjs.cloudflare.com/',
    'https://cdn.jsdelivr.net',
];

const styleUrls = [
    'https://kit-free.fontawesome.com/',
    'https://stackpath.bootstrapcdn.com/',
    'https://api.tiles.mapbox.com/',
    'https://api.mapbox.com/',
    'https://fonts.googleapis.com/',
    'https://use.fontawesome.net',
    'https://cdn.jsdelivr.net',
];

const connectUrls = [
    'https://api.mapbox.com/',
    'https://a.tiles.mapbox.com/',
    'https://b.tiles.mapbox.com/',
    'https://events.mapbox.com/',
];

const imgUrls = [
    `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/`,
    'https://images.unsplash.com/',
    'https://icon-library.com/',
];

const fontUrls = [];

/* eslint-disable */
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectUrls],
            scriptSrc: ["'self'", "'unsafe-inline'", ...scriptUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleUrls],
            workerSrc: ["'self'", 'blob:'],
            objectSrc: [],
            imgSrc: ["'self'", 'blob:', 'data:', ...imgUrls],
            fontSrc: ["'self'", ...fontUrls],
        },
    }),
);
/* eslint-enable */

app.use(helmet.crossOriginEmbedderPolicy({ policy: 'credentialless' }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (req.originalUrl !== '/login') req.session.returnTo = req.originalUrl;

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:campId/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
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

// const port = 3000;
const port = process.env.PORT;

app.listen(port, () => {
    console.log('listening on port 3000');
});
