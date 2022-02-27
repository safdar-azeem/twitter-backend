const express = require('express');
const router = express.Router();
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const userDetailsRoute = require('./userDetails.route');

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/userDetails', userDetailsRoute);

module.exports = router;