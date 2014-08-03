'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport');

//Get current user
exports.current = function (req, res) {
    res.json({ user: req.user || null });
};