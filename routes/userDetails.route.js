const express = require('express');
const router = express.Router();
const controller = require('../controllers/userDetails.controller');

router.post('/uploadAvatar', controller.uploadAvatar);

module.exports = router;

