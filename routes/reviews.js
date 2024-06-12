const express = require('express');
const { createReview, getReviewsForMovie } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/:movieId', getReviewsForMovie);

module.exports = router;
