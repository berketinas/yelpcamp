const express = require('express');
const passport = require('passport');
const asyncWrapper = require('../utils/asyncWrapper');
const UserController = require('../controllers/users');

const router = express.Router();

router.get('/register', UserController.renderRegister);

router.post('/register', asyncWrapper(UserController.register));

router.get('/login', UserController.renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), UserController.login);

router.get('/logout', UserController.logout);

module.exports = router;
