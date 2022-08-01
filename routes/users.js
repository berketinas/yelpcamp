const express = require('express');
const passport = require('passport');
const asyncWrapper = require('../utils/asyncWrapper');
const UserController = require('../controllers/users');

const router = express.Router();

router.route('/register')
    .get(UserController.renderRegister)
    .post(asyncWrapper(UserController.register));

router.route('/login')
    .get(UserController.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), UserController.login);

router.get('/logout', UserController.logout);

module.exports = router;
