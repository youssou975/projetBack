const express = require('express');
const {addNews,addComment, likeDislikeNews} = require('../Controllers/newcontroller');
const authMiddleware = require('../authMiddleware');

const router = express.Router();

router.post('/addNew',authMiddleware, addNews);
router.post('/addComment', authMiddleware, addComment);
router.post('/likeDislikeNews',authMiddleware,likeDislikeNews);
module.exports = router;
