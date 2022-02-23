const express = require('express');
const router = express.Router();
const userRoute = require('./user.route');

router.get('/', (req, res) => {
    res.send('Welcome to the API');
});

router.use('/user', userRoute);

module.exports = router;