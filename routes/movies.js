const express = require('express');
const { createMovie, getMovies, getMovie, searchMovies } = require('../controllers/movieController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createMovie);
router.get('/', getMovies);
router.get('/search', searchMovies);
router.get('/:id', getMovie);

module.exports = router;
