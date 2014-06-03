'use strict';

var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var path           = require('path');
var fs             = require('fs');
var mongoose       = require('mongoose');
var https          = require('https');
var app            = express();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./server/config/' + process.env.NODE_ENV);
var db = mongoose.connect(config.db.url, config.db.options);

var modelsPath     = path.join(__dirname, 'server/models');
var feedModelsPath = path.join(config.serverDir, 'data-feeds/models');

fs.readdirSync(modelsPath).forEach(function (model) {
  require(modelsPath + '/' + model);
});

fs.readdirSync(feedModelsPath).forEach(function (model) {
  require(feedModelsPath + '/' + model);
});

require(config.serverDir + '/seeder');
require(config.mainDir + '/passport');
require(config.mainDir + '/express')(app, config);
require(config.serverDir + '/routes')(app);

if (!process.env.FEEDS) {
	require(config.serverDir + '/data-feeds/transcom');
}
app.listen(config.port, function () {
  console.log('Express server listening at http://localhost:%d in %s mode', config.port, app.get('env'));
});

module.exports = app;