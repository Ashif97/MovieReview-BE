const express = require('express');
const { followUser, unfollowUser, addFavoriteMovie, removeFavoriteMovie, updateProfile, deleteAccount } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/follow', authMiddleware, followUser);
router.post('/unfollow', authMiddleware, unfollowUser);
router.post('/favorites', authMiddleware, addFavoriteMovie);
router.delete('/favorites', authMiddleware, removeFavoriteMovie);
router.put('/', authMiddleware, updateProfile);
router.delete('/:id', authMiddleware, deleteAccount);

module.exports = router;
