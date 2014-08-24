'use strict';

module.exports.format = {
	'ID': {
		path: ['event', 'ID'],
		type: 'integer',
		searchableByInterval: true
	},
	'Status': {
		path: ['event', 'Status'],
		type: 'integerRepresentation',
		modifiers: ['integerRepresentation'],
		extra: {
			representations: ['OK']
		}
	},
	'Direction': {
		path: ['event', 'Direction']
	},
	'RoadName': {
		path: ['event', 'RoadName']
	},
	'FromRoadName': {
		path: ['event', 'FromRoadName']
	},
	'ToRoadName': {
		path: ['event', 'ToRoadName']
	},
	'SpeedLimit (Km/H)': {
		path: ['event', 'SpeedLimit'],
		type: 'integer',
		searchableByInterval: true
	},
	'Length': {
		path: ['event', 'Length'],
		type: 'integer',
		searchableByInterval: true
	},
	'Start Latitude Point': {
		path: ['event', 'StartLoc', 'Lat'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Start Longitude Point': {
		path: ['event', 'StartLoc', 'Lon'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'End Latitude Point': {
		path: ['event', 'EndLoc', 'Lat'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'End Longitude Point': {
		path: ['event', 'EndLoc', 'Lon'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	}
};


module.exports.order = [
	'ID',
	'Status',
	'Direction',
	'RoadName',
	'FromRoadName',
	'ToRoadName',
	'SpeedLimit (Km/H)',
	'Length',
	'Start Latitude Point',
	'Start Longitude Point',
	'End Latitude Point',
	'End Longitude Point'
];

module.exports.db = 'mongodb';