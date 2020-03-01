'use strict';

const express = require('express');
const router = express.Router();

const robotRoute = require('./robot');
router.use('/robots', robotRoute);

const danceoffRoute = require('./danceoff');
router.use('/danceoffs', danceoffRoute);

module.exports = router;
