const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

router.get('/getUsers', controller.getUsers);
router.get('/getUserById/:id', controller.getUserById);
router.post('/uploadAvatarOrCover', controller.uploadAvatarOrCover);
router.put('/updateUser/:id', controller.updateUser);
router.put('/followUser/:userId/:followingId', controller.followUser);

module.exports = router;

