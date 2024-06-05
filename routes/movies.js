const express = require('express');
const { createMovie, getMovies, getMovie, searchMovies, updateMovie, deleteMovie } = require('../controllers/movieController');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createMovie);
router.get('/', getMovies);
router.get('/:id', getMovie);
router.get('/search', searchMovies);
router.put('/:id', auth, adminAuth, updateMovie);
router.delete('/:id', auth, adminAuth, deleteMovie);

module.exports = router;





