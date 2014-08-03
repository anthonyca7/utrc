var mongoose = require('mongoose'),
    schema = require('../data-feeds/transcom-schema'),
    _ = require('lodash'),
    Transcom = mongoose.model('Transcom');

module.exports.transcomEvents = function (req, res, next) {
  var Model = mongoose.model(req.params.evt);
  var criteria = JSON.parse(req.body.criteria || {});

  Model.find(criteria, {}, {
      skip: (req.params.page - 1) * (req.params.limit),
      limit: req.params.limit
    },
    function (err, data) {
      if (err) {
        console.log(err)
      }
      Model.count(criteria, function (err, count) {
        if (err) {
          console.log(err)
        }
        res.json({events: data, count: count});
      });
    });
};



