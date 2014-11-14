'use strict';

module.exports.format = {
	'ID': {
		path: ['LINK_ID'],
		type: 'integer',
		searchableByInterval: true
	},
	'Last Update': {
		path: ['LAST_UPDATE'],
		modifiers: ['date'],
		type: 'date',
		searchableByInterval: true
	},
	'Overall Status': {
		path: ['OVERALL_STATUS']
	},
	'Pavement Status': {
		path: ['PAVEMENT_STATUS']
	},
	'Weather Status': {
		path: ['WEATHER_STATUS']
	}
}

module.exports.order = [
	'ID',
	'Last Update',
	'Overall Status',
	'Pavement Status',
	'Weather Status'
];

module.exports.db = "mongodb";
module.exports.index = "LINK_ID";