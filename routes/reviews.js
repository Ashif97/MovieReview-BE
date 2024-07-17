const express = require('express');
const { createReview, getReviewsForMovie, getAverageRating,getUserMovies,updateReview,deleteReview  } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const {getTopReviews} = require('../controllers/getLatestReviews')
const router = express.Router();

router.post('/', createReview);
router.get('/by-user/:userId', getUserMovies);
router.get('/latest-reviews', (req, res, next) => {
    console.log('Route handler for /latest-reviews');
    next();
}, getTopReviews);
router.get('/reviews/:movieId/average-rating', getAverageRating);
router.get('/:movieId', getReviewsForMovie);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);
module.exports = router;

