const { MongoClient } = require("mongodb");
const logger = require('../../src/services/logger.service.ts')
const mongoose = require('mongoose');

const dbUri = process.env.ATLAS_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const client = new MongoClient(dbUri, options);
var _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("ttrm");
        mongoose.connect(dbUri,options);
        logger.info("Successfully connected to MongoDB.");
      }
      return callback(err);
    });
  },
  getDb: function () {
    return _db;
  }
};