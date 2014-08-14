'use strict';

var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    https = require('https'),
    app = express();

var cluster = require('cluster'),
    numCPUs = require('os').cpus().length;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var env = process.env.NODE_ENV,
    config = require('./config/' + env),
    db = mongoose.connect(config.db.url, config.db.options),
    modelsPath = path.join(__dirname, 'models');

fs.readdirSync(modelsPath).forEach(function (model) {
    require(modelsPath + '/' + model);
});

if (!process.env.NOFEEDS && cluster.isMaster) {
  console.log("Loading data feeds");
  require('./data-feeds/transcom');
}

if (cluster.isMaster) {
	require('./init-data');
}

require('./passport');
require('./express')(app, config);
require('./routes')(app);

app.all('/*', function (req, res) {
    res.sendfile('index.html', { root: config.client.dist });
});


if (cluster.isMaster) {
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});
} else {
	app.listen(config.port, function () {
		console.log('Express server listening at http://localhost:%d in %s mode', config.port, app.get('env'));
	});
}

module.exports = app;
