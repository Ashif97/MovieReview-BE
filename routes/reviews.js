const express = require('express');
const { createReview, getReviewsForMovie, getAverageRating } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const {getTopReviews} = require('../controllers/getLatestReviews')
const router = express.Router();

router.post('/', createReview);
router.get('/:movieId', getReviewsForMovie);
router.get('/reviews/:movieId/average-rating', getAverageRating);
router.get('/latest-reviews', (req, res, next) => {
    console.log('Route handler for /latest-reviews');
    next();
  }, getTopReviews);

module.exports = router;
