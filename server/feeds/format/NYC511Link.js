'use strict';

module.exports.format = {
	'Link ID': {
		path: ['LINK_ID'],
		type: 'integer',
		searchableByInterval: true
	},
	'Current Speed (MPH)': {
		path: ['CURRENT_SPEED'],
		type: 'integer',
		searchableByInterval: true
	},
	'Travel Time(Seconds)': {
		path: ['CURRENT_TRAVEL_TIME'],
		type: 'integer',
		searchableByInterval: true
	},
	'Last Update': {
		path: ['LAST_UPDATE'],
		modifiers: ['date'],
		type: 'date',
		searchableByInterval: true
	}
};

module.exports.order = [
	'Link ID',
	'Current Speed (MPH)',
	'Travel Time(Seconds)',
	'Last Update'
];

module.exports.db = "mongodb";
module.exports.index = "LINK_ID";