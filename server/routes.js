'use strict';

var express         = require('express'),
    core            = require('./controllers'),
    middleware      = require('./controllers/middleware'),
    transcom        = require('./controllers/transcom'),
    users           = require('./controllers/users'),
    session    = require('./controllers/session');

var router = express.Router();

module.exports = function(app) {  
  app.route('/api/users/me')
     .get(users.me);

  app.route('/api/session')
     .post(session.login)
     .delete(session.logout);

  //app.route.get('/api/transcom', transcom.transcomEvents);
  app.route('/api/event/:evt/:page/:limit')
     .post(middleware.auth, transcom.transcomEvents);

  app.route('/api/event/download/:evt/:cond?')
     .get(middleware.auth, transcom.makeTable);
  
  app.route('/partials/*')
     .get(core.partials);

  app.route('/login')
     .get(middleware.setUserCookie, core.index); 
  
  app.route('/data-interface')
     .get(middleware.setUserCookie, core.index); 

  app.route('*')
     .get(function (req, res) {
        res.send(400);
      });
}