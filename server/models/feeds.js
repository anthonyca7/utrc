'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FeedSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  format: {
    type: Schema.Types.Mixed
  }
});

module.exports = mongoose.model('Feed', FeedSchema);