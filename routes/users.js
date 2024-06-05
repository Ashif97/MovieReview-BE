const express = require('express');
const { followUser, unfollowUser, addFavoriteMovie, removeFavoriteMovie, updateProfile, deleteAccount } = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/:id/follow', auth, followUser);
router.post('/:id/unfollow', auth, unfollowUser);
router.post('/:id/favorites', auth, addFavoriteMovie);
router.delete('/:id/favorites', auth, removeFavoriteMovie);
router.put('/profile', auth, updateProfile);
router.delete('/profile/:id', auth, deleteAccount);

module.exports = router;
