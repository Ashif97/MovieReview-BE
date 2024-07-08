const express = require('express');
const { getAllUsers, deleteUser } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/users',  getAllUsers);
router.delete('/users/:id', authMiddleware, deleteUser);

module.exports = router;
