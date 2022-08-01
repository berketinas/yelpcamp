const express = require('express');
const asyncWrapper = require('../utils/asyncWrapper');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');
const ReviewController = require('../controllers/reviews');

const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, validateReview, asyncWrapper(ReviewController.create));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, asyncWrapper(ReviewController.delete));

module.exports = router;
