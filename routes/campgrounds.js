const express = require('express');
const asyncWrapper = require('../utils/asyncWrapper');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const CampgroundController = require('../controllers/campgrounds');

const router = express.Router();

router.get('/', asyncWrapper(CampgroundController.index));

router.post('/', isLoggedIn, validateCampground, asyncWrapper(CampgroundController.create));

router.get('/new', isLoggedIn, CampgroundController.renderNew);

router.get('/:id', asyncWrapper(CampgroundController.show));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, asyncWrapper(CampgroundController.edit));

router.delete('/:id', isLoggedIn, isAuthor, asyncWrapper(CampgroundController.delete));

router.get('/:id/edit', isLoggedIn, isAuthor, asyncWrapper(CampgroundController.renderEdit));

module.exports = router;
