'use strict';

const {Danceoff, Robot} = require('../models').models;
const ERR = require('../config/errors');
const MATCH = require('../config/match');

const EXP_INC = {
  WIN: 2,
  LOSS: 1,
};

module.exports.findAll = async(sort) => {
  if (sort && sort.length > 0) {
    const result = await Danceoff.getLeaderBoard(sort);
    return result;
  } else {
    let result = await Danceoff.findAll();
    return result;
  }
};

module.exports.findByRobotId = async(robotId) => {
  const result = await Danceoff.findByRobotId(robotId);
  return result.map(danceoff => {
    let withResult = {
      _id: danceoff._id,
      result: danceoff.winner._id.toString() === robotId ? 'win' : 'loss',
      winner: danceoff.winner,
      loser: danceoff.loser,
    };

    return withResult;
  });
};

module.exports.holdDanceoff = async(teams) => {
  if (!teams) {
    throw new Error(ERR.MSG.EMPTY_TEAMS);
  }
  if (teams.length !== MATCH.PROPS.TEAM_COUNT) {
    throw new Error(ERR.MSG.INCORRECT_TEAM_COUNT);
  }
  teams.forEach(team => {
    if (team.length !== MATCH.PROPS.TEAM_SIZE) {
      throw new Error(ERR.MSG.INCORRECT_TEAM_SIZE);
    }
  });
  if (!isAllUnique([].concat(...teams))) {
    throw new Error(ERR.MSG.DUPLICATE_ROBOT);
  }

  let battles = [];
  for (let i = 0; i < MATCH.PROPS.TEAM_SIZE; i++) {
    let battleResult = battle([teams[0][i], teams[1][i]]);
    battles.push(battleResult);
  }

  battles = await Promise.all(battles);
  await Danceoff.saveResults(battles);
  return battles;
};

const battle = async(robotIds) => {
  const [firstRobot, secondRobot] = await Robot.findByIds(robotIds);
  if (firstRobot == null || secondRobot == null) {
    throw new Error(ERR.MSG.NULL_ROBOT);
  }
  if (firstRobot.id === secondRobot.id) {
    throw new Error(ERR.MSG.SELF_BATTLE);
  }

  let [winner, loser] = matchUp(firstRobot, secondRobot);
  const battleResult = await Robot.updateExperience(winner.id, loser.id, EXP_INC);
  return battleResult;
};

const matchUp = (firstRobot, secondRobot) => {
  // by default, the one with more experience wins
  let winner = firstRobot.experience > secondRobot.experience ? firstRobot : secondRobot;
  let loser = firstRobot === winner ? secondRobot : firstRobot;

  // but if experience is within a specific range, luck determines the winner!
  if (winner.experience - loser.experience < MATCH.PROPS.EXP_RANGE) {
    if (Math.random() > 0.5) {
      let temp = winner;
      winner = loser;
      loser = temp;
    }
  }

  return [winner, loser];
};

const isAllUnique = (arr) => {
  return arr.length === new Set(arr).size;
};
