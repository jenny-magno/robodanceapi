'use strict';

const logger = require('winston');
logger.add(new logger.transports.Console, {});
module.exports = logger;
