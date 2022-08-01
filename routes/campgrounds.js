const express = require('express');
const asyncWrapper = require('../utils/asyncWrapper');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const CampgroundController = require('../controllers/campgrounds');

const router = express.Router();

router.route('/')
    .get(asyncWrapper(CampgroundController.index))
    .post(isLoggedIn, validateCampground, asyncWrapper(CampgroundController.create));

router.get('/new', isLoggedIn, CampgroundController.renderNew);

router.route('/:id')
    .get(asyncWrapper(CampgroundController.show))
    .put(isLoggedIn, isAuthor, validateCampground, asyncWrapper(CampgroundController.edit))
    .delete(isLoggedIn, isAuthor, asyncWrapper(CampgroundController.delete));

router.get('/:id/edit', isLoggedIn, isAuthor, asyncWrapper(CampgroundController.renderEdit));

module.exports = router;
