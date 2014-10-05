'use strict';

module.exports.format = {
	"name": {
		path: ["name"]
	},
	"status": {
		path: ["status"]
	},
	"Date": {
		path: ["Date"]
	},
	"Time": {
		path: ["Time"]
	},
	"Text": {
		path: ["text"]
	}
};

module.exports.order = [
	"name",
	"status",
	"Date",
	"Time",
	"Text"
];


module.exports.db = "mongodb";
