'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

/**
 * Passport configuration
 */
passport.serializeUser(function (user, done) {
	done(null, user.id);
});
passport.deserializeUser(function (id, done) {
	User.findOne({
		_id: id
	}, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
		done(err, user);
	});
});

// add other strategies for more authentication flexibility
passport.use(new LocalStrategy(
	function (username, password, done) {
		User.findOne({
			username: username
		}, function (err, user) {
			if (err) return done(err);

			if (!user) {
				return done(null, false, {
					message: 'The username is not correct'
				});
			}
			if (!user.authenticate(password)) {
				return done(null, false, {
					message: 'The password is not correct.'
				});
			}
			return done(null, user);
		});
	}
));

module.exports = passport;