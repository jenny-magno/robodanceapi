'use strict';

let robots = require('./robots.json');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Robot = require('../models/robot');

module.exports.addRobots = async() => {
  const modRobots = robots.map((robot) => {
    robot._id = ObjectId(robot._id);
    return robot;
  });
  await Robot.collection.insertMany(modRobots);
  return;
};
