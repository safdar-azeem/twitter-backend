const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/getUsers', controller.getUsers);
router.get('/getUserById/:id', controller.getUserById);
router.get('/findUsersByName/:name', controller.findUsersByName);
router.post('/uploadAvatarOrCover', authMiddleware, controller.uploadAvatarOrCover);
router.put('/updateUser/:id', authMiddleware, controller.updateUser);
router.put('/followUser/:userId/:followingId', authMiddleware, controller.followUser);
router.get('/suggestedUsers/:userId/', controller.getSuggestedUsers,
);
router.get(
	'/getUserFollowersOrFollowing/:userId/:type',
	controller.getUserFollowersOrFollowing,
);

module.exports = router;

