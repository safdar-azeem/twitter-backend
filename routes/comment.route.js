const express = require('express');
const router = express.Router();
const controller = require('../controllers/comment.controller');

router.get('/getCommentsByTweetId/:id', controller.getCommentsByTweetId);
router.post('/postComment', controller.postComment);

module.exports = router;
