'use strict';

var fs = require('fs'),
    path = require('path'),
    schemasPath = path.join(__dirname, 'data-feeds/defaultSchemas'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Transcom = mongoose.model('Transcom'),
    Feed = mongoose.model('Feed');

User.find({}).remove(function () {
  User.create({
      username: 'data-feed-admin',
      password: 'Admin'
    },
    function () {
      console.log('user added to the database');
    }
  );
});

Feed.find({}).remove(function () {
  fs.readdirSync(schemasPath).forEach(function (schemaName) {
    var name = schemaName.match("(.*).js")[1],
        schema = require(schemasPath + '/' + schemaName);

    Feed.create({
      name: name,
      format: schema.format,
	    order: schema.order,
	    database: schema.db
    });
  });
});

