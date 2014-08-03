'use strict';

var express = require('express'),
    path = require('path'),
    passport = require('passport'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    compression = require('compression'),
    errorHandler = require('errorhandler'),
    mongoStore = require('connect-mongo')(session),
    methodOverride = require('method-override');

var env = process.env.NODE_ENV || 'development';

module.exports = function (app, config) {
    app.use(config.staticUrl, compression());

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
    }

    app.use(config.staticUrl, express.static(config.client.dist));

    app.use(config.staticUrl, function (req, res, next) {
        res.send(404); // If we get here then the request for a static file is invalid
    });

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