'use strict';

var core = require('./controllers'),
    middleware = require('./controllers/middleware'),
    schemas = require('./controllers/schemas'),
    feeds = require('./controllers/feeds'),
    users = require('./controllers/users'),
    session = require('./controllers/session');

module.exports = function (app) {
	app.param('evt', feeds.loadEventData);

	app.route('/api/users/current')
		.get(users.current);

	app.route('/api/session')
		.post(session.login)
		.delete(session.logout);

	app.route('/api/feeds/:evt/:page/:limit')
		.post(feeds.sendEvents);

	app.route('/api/feeds/download/:evt/:feed/:date/:criteria?')
		.get(feeds.download);

	app.route('/api/schema')
		.get(schemas.all);
};