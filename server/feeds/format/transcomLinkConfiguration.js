'use strict';

module.exports.format = {
	'ID': {
		path: ['ID'],
		type: 'integer',
		searchableByInterval: true
	},
	'Status': {
		path: ['Status'],
		type: 'integerRepresentation',
		modifiers: ['integerRepresentation'],
		extra: {
			representations: ['OK']
		}
	},
	'Direction': {
		path: ['Direction']
	},
	'RoadName': {
		path: ['RoadName']
	},
	'FromRoadName': {
		path: ['FromRoadName']
	},
	'ToRoadName': {
		path: ['ToRoadName']
	},
	'SpeedLimit (Km/H)': {
		path: ['SpeedLimit'],
		type: 'integer',
		searchableByInterval: true
	},
	'Length': {
		path: ['Length'],
		type: 'integer',
		searchableByInterval: true
	},
	'Start Latitude Point': {
		path: ['StartLoc', 'Lat'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Start Longitude Point': {
		path: ['StartLoc', 'Lon'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'End Latitude Point': {
		path: ['EndLoc', 'Lat'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'End Longitude Point': {
		path: ['EndLoc', 'Lon'],
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