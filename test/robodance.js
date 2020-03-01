'use strict';

const testHelper = require('../src/scripts/helper');

process.env.NODE_ENV = 'test';
process.env.MONGODB_URL = 'mongodb://127.0.0.1/robodancedb-test';
let bots, sampleData, initialBots, initialDanceoffs;
let initialBotCount = 0; let initialDanceoffsCount = 0;

const app = require('../src/index');
const request = require('supertest');


describe('Get list of robots', function() {
  it('responds with json 200', function(done) {
    request(app)
      .get('/robots')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  it('responds with all robots', function(done) {
    request(app)
      .get('/robots')
      .expect(function(res) {
        res.length = initialBotCount + bots.length;
      })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('Get one specific robot', function() {
  it('responds with json', function(done) {
    request(app)
      .get(`/robots/${bots[0]._id}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  it('responds with the correct test robot', function(done) {
    request(app)
      .get(`/robots/${bots[0]._id}`)
      .expect(function(res) {
        res.name = bots[0].name;
        res._id = bots[0]._id;
      })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('Hold danceoffs', function() {
  it('responds with json 201', function(done) {
    request(app)
      .post('/danceoffs')
      .send(sampleData)
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  it('responds with correct number of battles', function(done) {
    request(app)
      .post('/danceoffs')
      .send(sampleData)
      .expect(function(res) {

        res.length = sampleData.teams[0].length;
      })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('Get list of danceoffs', function() {
  it('responds with json 200', function(done) {
    request(app)
      .get('/danceoffs')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  it('responds with all danceoffs', function(done) {
    request(app)
      .get('/danceoffs')
      .expect(function(res) {
        res.length = initialDanceoffsCount + sampleData.teams[0].length;
      })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('Get danceoffs for one specific robot', function() {
  it('responds with json', function(done) {
    request(app)
      .get(`/danceoffs/${bots[0]._id}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  it('responds with the correct danceoff data', function(done) {
    request(app)
      .get(`/danceoffs/${bots[0]._id}`)
      .expect(function(res) {
        res.name = bots[0].name;
        res._id = bots[0]._id;
      })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

before(async() => {
  initialBots = await testHelper.findRobots();
  initialBotCount = initialBots.length;

  initialDanceoffs = await testHelper.findDanceoffs();
  initialDanceoffsCount = initialDanceoffs.length;

  bots = await testHelper.addRobots();
  sampleData = testHelper.generateDanceoffRequest(bots);
});

after(async() => {
  await testHelper.deleteRobots(bots);
  await testHelper.deleteDanceoffs();
});
