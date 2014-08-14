var mongoose = require('mongoose'),
    _ = require('lodash'),
    Feed = mongoose.model('Feed'),
    Transcom = mongoose.model('Transcom');


var Modifiers = {};

Modifiers.def = function (value) {
	return value;
};

Modifiers.date = function (value) {
	return value;
	/*if (/^\d{4}([./-])\d{2}\1\d{2}/.test(value))
		return new Date(value, 'EEEE, MMM d, y h:mm a');
	else
		return null;*/
};

Modifiers.float = function (value) {
	if (typeof value === "number") {
		return value.toFixed(2);
	}
	return value;
};

Modifiers.integerRepresentation = function (value, extra) {
	if (typeof extra !== 'object' || !Array.isArray(extra.representations)) {
		return null;
	}

	return extra.representations[parseInt(value)];
};

Modifiers.complexObject = function (value) {
	var result = [], i;
	var keys = Object.keys(value);

	for(i=0;i<keys.length;i++){
		result.push("("+keys[i]+":"+value[keys[i]]+")");
	}

	return "( " + result.join(", ") + " )";
};

Modifiers.complexArray = function (value) {
	var result = [];

	value.forEach(function (element) {
		if (typeof element === 'object') {
			result.push(Modifiers.complexObject(element));
		}
		else{
			result.push(element);
		}
	});

	return result.join(", ");
};

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

module.exports.download = function (req, res, next) {
	var Model = mongoose.model(req.params.evt);
	var criteria = (req.params.criteria) ? JSON.parse(req.params.criteria):{};
	var name = req.params.evt.toLowerCase();

	Feed.findOne({ name: name }, function (err, schema) {
		if (err) return next(err);

		var format = schema.format,
				header = schema.order;

		Model.find(criteria, function (err, data) {
			var file = name + "_event_" + getCurrentDate();

			res.setHeader('Content-disposition', 'attachment; filename=' + file + '.txt');
			res.setHeader('Content-type', 'text/plain');
			res.charset = 'UTF-8';

			sendEvents(res, data, format, header);
		});

	});
};

function getCurrentDate() {
	var date = new Date();
	var month = date.getMonth()+1;
	var result = "";

	function format(value) {
		return ( value < 10 ) ? "0"+value:value;
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
			var modifier = Modifiers[name] || Modifiers['def'];
			value = modifier(value, eventFormat.extra);
		});
	}

	if (value && typeof value==='object') {
		if (value.constructor.name === 'Array') {
			value = Modifiers.complexArray(value);
		} else {
			value = Modifiers.complexObject(value);
		}
	}

	return value;
}

function sendEvents(res, data, format, header) {
	var i,j;

	res.write(header.join('\t') + '\n');

	for(i=0;i<data.length;i++) {
		var event = data[i], cell;
		for(j=0; j<header.length;j++) {
			cell = getEventField(event, format, header[j]);

			if (cell == null) cell = "";

			//console.log(cell==null, cell=="null", cell);
			res.write(cell + "\t");
		}
		res.write('\n');
	}

	res.end();
}

function getEventField(data, schema, column) {
	var eventFormat = schema[column],
	    path = eventFormat.path,
	    cellValue = data.event, i, j, object;

	for (i=0;i<path.length;i++) {
		if (typeof cellValue === "object" && cellValue.constructor === Array) {
			for (j=0;j<cellValue.length;j++) {
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


