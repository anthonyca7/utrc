'use strict';

var core       = require('./controllers/core'),
    middleware = require('./controllers/core/middleware'),
    transcom   = require('./controllers/transcom'),
    users      = require('./controllers/users'),
    session    = require('./controllers/session');

module.exports = function(app) {  
  app.get('/api/users/me', users.me);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  //app.get('/api/transcom', transcom.transcomEvents);
  app.post('/api/event/:evt/:page/:limit', /*middleware.auth, */transcom.transcomEvents);
  
  app.get('/partials/*', core.partials);
  app.get('/login', middleware.setUserCookie, core.index); 
  app.get('/data-interface', middleware.setUserCookie, core.index); 

  app.get('*', function (req, res) {
    res.send(400);
  })
}