const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

router.get('/getUsers', controller.getUsers);
router.post('/createUser', controller.createUser)
router.post('/loginUser', controller.loginUser);

module.exports = router;

