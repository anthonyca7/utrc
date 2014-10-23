var mongoose = require('mongoose'),
    _ = require('lodash'),
    Feed = mongoose.model('Feed'),
    mongoskin = require('mongoskin'),
    dataModifiers = require('../feeds/modifiers'),
    Transcom = mongoose.model('Transcom');


var db = mongoskin.db('mongodb://@localhost:27017/utrc', {safe: true});

db.bind('transcomEvents');
db.bind('transcomConfigurations');
db.bind('transcomConditions');
db.bind('511NY_events');
db.bind('511NY_links');
db.bind('511NY_wtastatus');
db.bind('511NY_wtasegmentdata');
db.bind('511NY_vms');
db.bind('MTABTStatus');
db.bind('MTALIRRStatus');
db.bind('MTABusStatus');
db.bind('MTAMetroNorthStatus');
db.bind('MTASubwayStatus');
db.bind('MTAOutages');
db.bind('MTALostFound');
db.bind('NYCDOTTrafficSpeed');
db.bind('feeds');
db.bind('older_NY511FEED_events');
db.bind('older_NY511FEED_linkconditions');
db.bind('older_NY511FEED_linkinventory');
db.bind('older_NY511FEED_links');
db.bind('older_NY511FEED_wtastatus');

module.exports.loadEventData = function (req, res, next) {
	var query = req.params.criteria || req.body.criteria;
	var criteria = (query) ? JSON.parse(query):{};
	var name = req.params.evt;

	if (db[name] == null) {
		return res.json({event: null});
	}

	db[name].find(criteria, {}, {
		skip: (req.params.page - 1) * (req.params.limit),
		limit: req.params.limit
	}, function (err, data) {
		data.toArray(function (err, data) {
			if (err) {
				console.log(err);
				res.end(err);
			}
			db[name].count(criteria, function (err, count) {
				if (err) {
					console.log(err);
					res.end(err);
				}

				req.events = data;
				req.count = count;
				next();
			});
		});
	});
};

module.exports.sendEvents = function (req, res, next) {
	res.json({events: req.events, count: req.count });
};

module.exports.download = function (req, res, next) {
	var name = req.params.feed.toLowerCase();

	Feed.findOne({ name: name }, function (err, schema) {
		if (err) return next(err);

		var format = schema.format,
		    header = schema.order;

		var file = name + "_event_" + req.params.date || getCurrentDate();

		res.setHeader('Content-disposition', 'attachment; filename=' + file + '.txt');
		res.setHeader('Content-type', 'text/plain');
		res.charset = 'UTF-8';

		sendEvents(res, req.events, format, header);

	});
};

function getCurrentDate() {
	var date = new Date();
	var month = date.getMonth() + 1;
	var result = "";

	function format(value) {
		return ( value < 10 ) ? "0" + value : value;
	}

	result += format(month) + format(date.getDate()) + date.getFullYear() + "_" +
		format(date.getHours()) + format(date.getMinutes()) + format(date.getSeconds());

	return result;

}

function modifyData(value, eventFormat) {
	var modifiers = eventFormat.modifiers;

	if (value == null) return null;

	if (typeof modifiers === "object" && modifiers.constructor == Array) {
		modifiers.forEach(function (name) {
			var modifier = dataModifiers[name] || dataModifiers['def'];
			value = modifier(value, eventFormat.extra);
		});
	}

	if (value && typeof value === 'object') {
		if (value.constructor.name === 'Array') {
			value = dataModifiers.complexArray(value);
		} else {
			value = dataModifiers.complexObject(value);
		}
	}

	return value;
}

function sendEvents(res, data, format, header) {
	var i, j;

	res.write(header.join('\t') + '\n');

	for (i = 0; i < data.length; i++) {
		var event = data[i], cell;
		for (j = 0; j < header.length; j++) {
			cell = getEventField(event, format, header[j]);

			if (cell == null) cell = "";

			res.write(cell + "\t");
		}
		res.write('\n');
	}

	res.end();
}

function getEventField(data, schema, column) {
	var eventFormat = schema[column],
	    path = eventFormat.path,
	    cellValue = data, i, j, object;

	for (i = 0; i < path.length; i++) {
		if (typeof cellValue === "object" && cellValue.constructor === Array) {
			for (j = 0; j < cellValue.length; j++) {
				object = cellValue[j];

				if (object.hasOwnProperty(path[i])) {
					cellValue = object[path[i]];
					break;
				}
			}
			if (j === cellValue.length) {
				return null;
			}
		} else if (cellValue.hasOwnProperty([path[i]])) {
			cellValue = cellValue[path[i]];
		} else {
			return null;
		}
	}

	return modifyData(cellValue, eventFormat);
}


