'use strict';

var core = require('./controllers'),
    middleware = require('./controllers/middleware'),
    schemas = require('./controllers/schemas'),
    transcom = require('./controllers/transcom'),
    users = require('./controllers/users'),
    session = require('./controllers/session');

module.exports = function (app) {
    app.route('/api/users/current')
      .get(users.current);

    app.route('/api/session')
      .post(session.login)
      .delete(session.logout);

    app.route('/api/feeds/:evt/:page/:limit')
      .post(transcom.transcomEvents);

		app.route('/api/feeds/download/:evt/:criteria?')
			.get(transcom.download);

    app.route('/api/schema')
      .get(schemas.all);
}