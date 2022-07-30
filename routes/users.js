const express = require('express');
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

        req.flash('success', `Welcome to YelpCamp, ${registered.username}`);
        res.redirect('/campgrounds');
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}));

module.exports = router;
