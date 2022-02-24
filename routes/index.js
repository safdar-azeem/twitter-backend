const express = require('express');
const router = express.Router();
const userRoute = require('./user.route');
const authRoute = require('./auth.route');

router.use('/auth', authRoute);
router.use('/user', userRoute);

module.exports = router;