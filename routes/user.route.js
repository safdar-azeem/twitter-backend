const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

router.get('/getUsers', controller.getUsers);
router.get('/getUserById/:id', controller.getUserById);

module.exports = router;

