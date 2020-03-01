'use strict';

let robots = require('../data/robots.json');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Robot = require('../src/models/robot');

module.exports.rebuild = async() => {
  await Robot.find().deleteMany();
  const modRobots = robots.map((robot) => {
    robot._id = ObjectId(robot._id);
    return robot;
  });
  await Robot.collection.insertMany(modRobots);
  return;
};
