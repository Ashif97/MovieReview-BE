const express = require('express');
const { createMovie, getMovies, getMovie, searchMovies,deleteMovie } = require('../controllers/movieController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', createMovie);
router.get('/', getMovies);
router.get('/search', searchMovies);
router.get('/:id', getMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
