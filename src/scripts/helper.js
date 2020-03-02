'use strict';

let robots = require('./robots.json');
const MATCH = require('../config/match');
const {Robot, Danceoff} = require('../models').models;

module.exports.addRobots = async() => {
  const modRobots = robots.map((robot) => {
    return robot;
  });
  const res = await Robot.collection.insertMany(modRobots);
  return res.ops;
};

module.exports.addRobotsIfEmpty = async() => {
  const bots = await Robot.find();
  if (bots.length === 0) {
    await this.addRobots();
  }
};

module.exports.deleteRobots = async(robots) => {
  const modRobots = robots.map((robot) => {
    return robot._id;
  });

  const res = await Robot.collection.deleteMany({
    _id: { $in: modRobots },
  });
  return res.ops;
};

module.exports.deleteDanceoffs = async() => {
  const res = await Danceoff.collection.deleteMany();
  return res;
};

module.exports.findRobots = async() => {
  const res = await Robot.find();
  return res;
};

module.exports.findDanceoffs = async() => {
  const res = await Danceoff.find();
  return res;
};

module.exports.generateDanceoffRequest = (robots) => {
  if (robots.length < MATCH.PROPS.TEAM_COUNT * MATCH.PROPS.TEAM_SIZE) {
    throw new Error('Not enough test robots');
  }
  const modRobots = robots.map((robot) => {
    return robot._id;
  });

  let teams = [];
  for (let i = 0; i < MATCH.PROPS.TEAM_COUNT; i++) {
    teams.push(modRobots.slice(
      i * MATCH.PROPS.TEAM_SIZE,
      (i + 1) * MATCH.PROPS.TEAM_SIZE));
  }

  return {
    teams: teams,
  };
};
