const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookMark.controller');

router.post('/add/:userId/:tweetId', controller.addBookmark);

module.exports = router;
