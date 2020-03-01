'use strict';

const express = require('express');
const robot = express.Router();
const robotController = require('../controllers/robot');

robot.get('/', robotController.findAllRobots);
robot.get('/:id', robotController.findRobotsById);

module.exports = robot;
