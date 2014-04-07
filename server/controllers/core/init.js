'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

User.find({}).remove(function() {
   User.create({
       username: 'data-feed-admin',
       password: 'admin'
   },
   function() {
      console.log('user added to the database');
    }
  );
});
