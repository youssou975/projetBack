const express = require('express');
const {calculateTotalScore} = require('../Controllers/scoreController');
const authMiddleware = require('../authMiddleware');

const router = express.Router();

router.get('/totalscore', calculateTotalScore);

module.exports = router;
