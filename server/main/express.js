'use strict';

var express        = require('express'),
    path           = require('path'),
    passport       = require('passport'),
    morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    session        = require('express-session'),
    cookieParser   = require('cookie-parser'),
    errorHandler   = require('errorhandler'),
    mongoStore     = require('connect-mongo')(session),
    methodOverride = require('method-override');


// app.use(express.static(__dirname + '/public'));  
// app.use(morgan('dev'));           
// app.use(bodyParser());            
// app.use(methodOverride()); 

var env = process.env.NODE_ENV || 'development';


module.exports = function(app, config) {
  if (env === 'development') {
    app.use(require('connect-livereload')());

    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });
    app.use(express.static(config.client));
    app.set('views', config.views);
  }
  else if (env === 'production'){
    //app.use(express.favicon(config.client + '/favicon.ico'));
    app.use(express.static(config.client));
    app.set('views', config.views);
  }


  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  // app.use(logger('dev'));
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(cookieParser());

  // Persist sessions with mongoStore
  app.use(session({
    secret: 'secret',
    store: new mongoStore({
      url: config.db.url,
      collection: 'sessions'
    }, function () {
        console.log("db connection open");
    })
  }));

  //log into the console
  app.use(morgan('dev')); 

  //use passport session
  app.use(passport.initialize());
  app.use(passport.session());
    
  // Error handler
  app.use(errorHandler());
};