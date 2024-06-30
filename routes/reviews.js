const express = require('express');
const { createReview, getReviewsForMovie, getAverageRating } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', createReview);
router.get('/:movieId', getReviewsForMovie);
router.get('/reviews/:movieId/average-rating', getAverageRating);

module.exports = router;
