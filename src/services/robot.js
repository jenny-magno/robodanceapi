'use strict';

const {Robot} = require('../models').models;

module.exports.findAll = async(working) => {
  const result = await Robot.findAll(working);
  return result;
};

module.exports.findById = async(robotId) => {
  const result = await Robot.findById(robotId);
  return result;
};
