'use strict';

var mongoose = require('mongoose'),
    User     = mongoose.model('User'),
    passport = require('passport');

//Get current user
exports.me = function(req, res) {
  res.json(req.user || null);
};