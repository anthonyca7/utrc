'use strict';

module.exports.format = {
	'ID': {
		path: ['EVENT_ID'],
		type: 'integer',
		modifiers: ['toNumber'],
		searchableByInterval: true
	}, 
	'Event Class': {
		path: ['EVENT_CLASS']
	},
	'Event Type': {
		path: ['EVENT_TYPE']
	},
	'Reporting Organization ID': {
		path: ['REPORT_ORG_ID']
	},
	'Facility': {
		path: ['FACILITY_NAME']
	},
	'Direction': {
		path: ['DIRECTION']
	},
	'Article': {
		path: ['ARTICLE_CODE']
	},
	'Starting Point': {
		path: ['FROM_LOC_POINT']
	},
	'Ending Point': {
		path: ['TO_LOC_POINT']
	},
	'Creation Date': {
		path: ['CREATE_TIME'],
		modifiers: ['date'],
		type: 'date',
		searchableByInterval: true
	},
	'Last Update': {
		path: ['LAST_UPDATE'],
		modifiers: ['date'],
		type: 'date',
		searchableByInterval: true
	},
	'Description': {
		path: ['EVENT_DESCRIPTION']
	},
	'City': {
		path: ['CITY']
	},
	'County': {
		path: ['COUNTY']
	},
	'State': {
		path: ['STATE']
	},
	'Event Duration (seconds)': {
		path: ['EST_DURATION'],
		type: 'integer',
		searchableByInterval: true
	},
	'Starting Point Latitude': {
		path: ['LAT'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Starting Point Longitude': {
		path: ['LON'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Ending Point Latitude': {
	 	path: ['TO_LAT'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Ending Point Longitude': {
		path: ['TO_LON'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Lanes Affected': {
		path: ['LANES_AFFECTED'],
		type: 'integer',
		searchableByInterval: true
	},
	'Lanes Status': {
		path: ['LANE_STATUS']
	},
	'Total Lanes': {
		path: ['TOTAL_LANES'],
		type: 'integer',
		searchableByInterval: true
	},
	'Lane Description': {
		path: ['LANE_DESCRIPTION']
	},
	'Lane Details': {
		path: ['LANE_DETAIL']
	},
	'Update Number': {
		path: ['UPDATE_NUMBER'],
		type: 'integer',
		searchableByInterval: true
	},
	'Event Creator': {
		path: ['RESPOND_ORG_ID']
	},
	'Pavement Condition': {
		path: ['PAVEMENT_CONDITION']
	},
	'Weather Condition': {
		path: ['WEATHER_CODITION']
	},
	'Start Date': {
		path: ['START_DATE'],
		modifiers: ['date'],
		type: 'date',
		searchableByInterval: true
	},
	'End Date': {
		path: ['END_DATE'],
		modifiers: ['date'],
		type: 'date',
		searchableByInterval: true
	},
	'Other Information': {
		path: ['EVENT_OTHER_DESC']
	},
	'Starting Filemarker Affected': {
		path: ['From_Mile_Marker'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Ending Filemarker Affected': {
		path: ['To_Mile_Marker'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Is Local?': {
		path: ['LOCAL_ONLY'],
		type: 'boolean'
	},
	'Construction Type': {
		path: ['CONSTRUCTION_TYPE']
	},
	'Confirmation Code': {
		path: ['CONFIRMATION_CODE']
	},
	'Closure Type': {
		path: ['CLOSURE_TYPE']
	}
};

module.exports.order = [
	'ID',
	'Event Class',
	'Event Type',
	'Reporting Organization ID',
	'Facility',
	'Direction',
	'Article',
	'Starting Point',
	'Ending Point',
	'Creation Date',
	'Last Update',
	'Description',
	'City',
	'County',
	'State',
	'Event Duration (seconds)',
	'Starting Point Latitude',
	'Starting Point Longitude',
	'Ending Point Latitude',
	'Ending Point Longitude',
	'Lanes Affected',
	'Lanes Status',
	'Total Lanes',
	'Lane Description',
	'Lane Details',
	'Update Number',
	'Event Creator',
	'Pavement Condition',
	'Weather Condition',
	'Start Date',
	'End Date',
	'Other Information',
	'Starting Filemarker Affected',
	'Ending Filemarker Affected',
	'Is Local?',
	'Construction Type',
	'Confirmation Code',
	'Closure Type'
];

module.exports.db = "mongodb";
module.exports.index = "EVENT_ID";