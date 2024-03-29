'use strict';

var mongoose = require('mongoose'),
    passport = require('passport');

exports.logout = function (req, res) {
	req.logout();
	res.send(200);
};

exports.login = function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		var error = err || info;
		if (error) return res.json(400, error);

		req.logIn(user, function (err) {

			if (err) return res.send(err);
			res.json({user: req.user.userInfo});
		});
	})(req, res, next);
};