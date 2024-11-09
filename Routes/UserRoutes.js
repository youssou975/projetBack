const express = require('express');
const { createUser,loginUser } = require('../Controllers/userController');

const { getLikedNewsTitlesByUser } = require('../Controllers/likeController');



const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/:login/titre-aime', getLikedNewsTitlesByUser);


module.exports = router;
