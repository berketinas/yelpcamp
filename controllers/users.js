const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = await new User({ email, username });
        const registered = await User.register(newUser, password);

        req.login(registered, (err) => {
            if (err) return next(err);

            req.flash('success', `Welcome to YelpCamp, ${registered.username}.`);
            return res.redirect('/campgrounds');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', `Welcome back, ${req.user.username}.`);

    const redirectUrl = req.session.returnTo || '/campgrounds';

    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        return res.redirect('/login');
    });
};
