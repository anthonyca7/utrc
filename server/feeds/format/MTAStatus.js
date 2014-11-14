'use strict';

module.exports.format = {
	"name": {
		path: ["name"]
	},
	"status": {
		path: ["status"]
	},
	"Date": {
		path: ["Date"],
		modifiers: ['datent'],
		type: 'date',
		searchableByInterval: true
	},
	"Time": {
		path: ["Time"], 
		modifiers: ['time'],
		notSearchable: true
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
module.exports.index = "name"
