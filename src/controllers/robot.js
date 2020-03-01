'use strict';

const robotService = require('../services/robot');

module.exports.findRobotsById = async(req, res) => {
  try {
    const result = await robotService.findById(req.params.id);
    if (result == null) {
      res.status(404).end();
    }
    res.json(result);
  } catch (e) {
    res.statusMessage = e;
    res.status(500).end();
  }
};

module.exports.findAllRobots = async(req, res) => {
  try {
    const working = req.query.working;
    const result = await robotService.findAll(working);
    res.json(result);
  } catch (e) {
    res.statusMessage = e;
    res.status(500).end();
  }
};

