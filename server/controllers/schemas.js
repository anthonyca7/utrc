'use strict';

var fs = require('fs'),
    mongoose = require('mongoose'),
    Feed = mongoose.model('Feed');

exports.all = function (req, res, next) {
	Feed.find({}, function (err, schemas) {
		if (err) return next(err);
		res.json(schemas);
	});
};
