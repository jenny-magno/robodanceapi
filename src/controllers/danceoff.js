'use strict';

const danceoffService = require('../services/danceoff');

module.exports.holdDanceoff = async(req, res) => {
  try {
    const result = await danceoffService.holdDanceoff(req.body.teams);
    res.status(201).json(result);
  } catch (e) {
    res.status(e.status || 500).send(typeof e.data === 'function' ? e.data() : e);
  }
};

module.exports.findAllDanceoffs = async(req, res) => {
  try {
    const sortBy = req.query.sort;
    const result = await danceoffService.findAll(sortBy);

    res.json(result);
  } catch (e) {
    res.status(e.status || 500).send(typeof e.data === 'function' ? e.data() : e);
  }
};

module.exports.findDanceoffsByRobot = async(req, res) => {
  try {
    const robotId = req.params.id;
    const result = await danceoffService.findByRobotId(robotId);
    if (result == null) {
      return res.status(404).end();
    }
    res.json(result);
  } catch (e) {
    res.status(e.status || 500).send(typeof e.data === 'function' ? e.data() : e);
  }
};

