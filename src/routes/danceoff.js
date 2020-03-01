'use strict';

const express = require('express');
const danceoff = express.Router();
const danceoffController = require('../controllers/danceoff');

danceoff.get('/', danceoffController.findAllDanceoffs);
danceoff.get('/:id', danceoffController.findDanceoffsByRobot);
danceoff.post('/', danceoffController.holdDanceoff);

module.exports = danceoff;
