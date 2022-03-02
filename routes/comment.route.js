const express = require('express');
const router = express.Router();
const controller = require('../controllers/comment.controller');

router.post('/postComment', controller.postComment);

module.exports = router;
