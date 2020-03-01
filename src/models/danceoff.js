'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const mergeByKey = require('array-merge-by-key');


const danceoffSchema = new Schema({
  winner: { type: ObjectId, ref: 'Robot'},
  loser: { type: ObjectId, ref: 'Robot'},
});

const hideVersioning = {
    "__v": 0
};

danceoffSchema.statics.getLeaderBoard = async function(sort) {
  let [wins, losses] = await Promise.all([this.getWinCounts(), this.getLossCounts()]);
  let result = mergeById(wins, losses);
  sortItems(result, sort);
  return result;
};

danceoffSchema.statics.getWinCounts = async function() {
  const result = await this.aggregate([
    {
      $group: {
        _id: '$winner',
        wins: {
          $sum: 1,
        },
      },
    },
  ]);

  return result;
};

danceoffSchema.statics.getLossCounts = async function() {
  const result = await this.aggregate([
    {
      $group: {
        _id: '$loser',
        losses: {
          $sum: 1,
        },
      },
    },
  ]);
  return result;
};

danceoffSchema.statics.findAll = async function() {
  let danceoffs = await this.find().select(hideVersioning);
  return danceoffs;
};

danceoffSchema.statics.findByRobotId = async function(robotId) {
  let danceoffs = await this.find({
    $or: [
      {
        loser: robotId,
      },
      {
        winner: robotId,
      },
    ],
  }).select(hideVersioning);
  return danceoffs;
};

danceoffSchema.statics.saveResults = async function(battles) {
  Danceoff.insertMany(battles.map(battle => {
    return {
      winner: battle.winner._id,
      loser: battle.loser._id,
    };
  }));
};


const sortItems = (result, sort) => {
  result.sort((a, b) => {
    if (sort === 'wins') {
      return a.wins === b.wins ? a.losses - b.losses : b.wins - a.wins;
    } else if (sort === 'losses') {
      return a.losses === b.losses ? a.wins - b.wins : b.losses - a.losses;
    }
  });
};

const mergeById = (wins, losses) => {
  let merged = mergeByKey(
    '_id', wins.map(win => {
      win._id = win._id.toString();
      return win;
    }), losses.map(loss => {
      loss._id = loss._id.toString();
      return loss;
    }));

  merged.map((robot) => {
    robot.wins = robot.wins || 0;
    robot.losses = robot.losses || 0;
    return robot;
  });

  return merged;
};


const Danceoff = mongoose.model('Danceoff', danceoffSchema);
module.exports = Danceoff;
