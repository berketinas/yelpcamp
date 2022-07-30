const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const asyncWrapper = require('../utils/asyncWrapper');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', asyncWrapper(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = await new User({ email, username });
        const registered = await User.register(newUser, password);

        req.flash('success', `Welcome to YelpCamp, ${registered.username}.`);
        res.redirect('/campgrounds');
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back.');
    res.redirect('/campgrounds');
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        return res.redirect('/login');
    });
});

module.exports = router;
