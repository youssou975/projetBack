const express = require('express');
const {addNews,addComment,traiteReponseNews} = require('../Controllers/newcontroller');
const authMiddleware = require('../authMiddleware');
const{likeDislikeNews}=require('../Controllers/likeController');
const router = express.Router();
const { getLikesDislikesUsers } = require('../Controllers/likeController');

router.post('/addNew',authMiddleware, addNews);
router.post('/addComment', authMiddleware, addComment);
router.post('/likeDislikeNews',authMiddleware,likeDislikeNews);
router.get('/viewNews', traiteReponseNews);
router.get('/getLikeDislike/:newsId', authMiddleware, getLikesDislikesUsers);

module.exports = router;
