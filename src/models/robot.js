'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const robotData = {
  name: String,
  powermove: String,
  experience: Number,
  outOfOrder: {
    type: Boolean,
    default: false,
  },
  avatar: String,
};
const robotSchema = new Schema(robotData);

robotSchema.statics.findAll = async function(working) {
  let filter = {};
  if (working === 'true') {
    filter.outOfOrder = false;
  } else if (working === 'false') {
    filter.outOfOrder = true;
  }
  // otherwise, get all robots regardless of working status

  let robots = await this.find(filter);
  return robots;
};

robotSchema.statics.findByIds = async function(robotIdArr) {
  const obj_ids = robotIdArr.map((robotId) => { return ObjectId(robotId); });
  const result = await this.find({
    _id: { $in: obj_ids },
  });

  return result;
};

robotSchema.statics.updateWinner = async function(winnerId, expInc) {
  const winner = await this.findOneAndUpdate(
    {
      _id: ObjectId(winnerId),
    },
    {
      $inc: {
        experience: expInc.WIN,
      },
    },
    {
      returnOriginal: false,
    },
  );

  return winner;
};

robotSchema.statics.updateLoser = async function(loserId, expInc) {
  const loser = await this.findOneAndUpdate(
    {
      _id: ObjectId(loserId),
    },
    {
      $inc: {
        experience: expInc.LOSS,
      },
    },
    {
      returnOriginal: false,
    },
  );

  return loser;
};

robotSchema.statics.updateExperience = async function(winnerId, loserId, expInc) {
  let [winner, loser] = await Promise.all([
    this.updateWinner(winnerId, expInc),
    this.updateLoser(loserId, expInc),
  ]);
  return {
    winner: winner,
    loser: loser,
  };
};

const Robot = mongoose.model('Robot', robotSchema);
module.exports = Robot;
module.exports.robotData = robotData;
