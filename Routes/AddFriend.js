const express = require('express');
const { addFriend } = require('../Controllers/addFriend');
const authMiddleware = require('../authMiddleware');

const router = express.Router();

router.post('/addFriend', authMiddleware,addFriend);
//router.get('/friends',authMiddleware,getFriendsList)

module.exports = router;
