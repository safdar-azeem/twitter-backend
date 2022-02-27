const express = require('express');
const router = express.Router();
const controller = require('../controllers/userDetails.controller');

router.post('/uploadAvatar', controller.uploadAvatar);
router.post('/editUserDetails/:userId', controller.editUserDetails);

module.exports = router;

