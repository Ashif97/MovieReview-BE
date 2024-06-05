const express = require('express');
const { getOverview } = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/overview', auth, isAdmin, getOverview);

module.exports = router;
