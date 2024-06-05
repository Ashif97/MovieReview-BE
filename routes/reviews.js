const express = require('express');
const { createReview, getReviewsForMovie } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createReview);
router.get('/:movieId', getReviewsForMovie);

module.exports = router;
