'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const logger = require('./services/log');

require('dotenv').config();

const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(cors());
app.use(morgan('combined'));

app.use('/', routes);

const connectDb = async() => {
  const mongoose = require('mongoose');

  const mongoDB = process.env.MONGODB_URL || 'mongodb://127.0.0.1/robodancedb';
  await mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  if (process.env.INIT_ROBOTS === 'Y') {
    const robots = require('../scripts/robots');
    await robots.rebuild();
  }
};

connectDb().then(async() => {
  const port = process.env.PORT || 3001;
  app.listen(port, () =>
    console.log(`ROBODANCE API
    [START] App running on port ${port}`),
  );
}).catch(e => {
  console.log(`Error starting application:
   ${e}`);
});
