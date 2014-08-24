'use strict';

var eventStates = ['New event', 'Updated Event'];
eventStates[255] = 'Schedule Event (Planned)';

module.exports.format = {
	'ID': {
		path: ['event', 'EventID']
	},
	'Associated ID': {
		path: ['event', 'AssociatedEventID']
	},
	'Event Class': {
		path: ['event', 'EventClass'],
		type: 'integerRepresentation',
		modifiers: ['integerRepresentation'],
		extra: {
			representations: ['Incident', 'Construction', 'Special Event']
		}
	},
	'Event State': {
		path: ['event', 'EventState'],
		type: 'integerRepresentation',
		modifiers: ['integerRepresentation'],
		extra: {
			representations: eventStates
		}
	},
	'Date Started': {
		path: ['event', 'StartDateTime'],
		modifiers: ['date'],
		type: 'date',
		searchableByInterval: true
	},
	/*'Hour Started': {
	 path: ['StartDateTime'],
	 modifiers: ['date'],
	 type: 'date'
	 },*/
	'Time Left (minutes)': {
		path: ['event', 'EstDurationInMinutes'],
		type: 'integer',
		searchableByInterval: true
	},
	'Last Update': {
		path: ['event', 'LastUpdate'],
		modifiers: ['date'],
		type: 'date',
		searchableByInterval: true
	},
	'Type': {
		path: ['event', 'EventTypes', 'EventType']
	},
	'Lanes Affected': {
		path: ['event', 'LaneDetails', 'LanesAffectedCount'],
		type: 'integer',
		searchableByInterval: true
	},
	'Lanes Details': {
		path: ['event', 'LaneDetails', 'LanesDetail']
	},
	'Lanes Status': {
		path: ['event', 'LaneDetails', 'LanesStatus']
	},
	'Description': {
		path: ['event', 'SummaryDescription']
	},
	'Reporting Organization': {
		path: ['event', 'ReportingOrg'],
		type: 'integer',
		searchableByInterval: true
	},
	'Facility': {
		path: ['event', 'EventLocationInfo', 'Facility']
	},
	'City': {
		path: ['event', 'EventLocationInfo', 'City']
	},
	'State': {
		path: ['event', 'EventLocationInfo', 'State']
	},
	'County': {
		path: ['event', 'EventLocationInfo', 'County']
	},
	'Direction': {
		path: ['event', 'EventLocationInfo', 'Direction']
	},
	'Comments': {
		path: ['event', 'Comments', 'CommentInfo', 'Comment']
	},
	'Article - Interception': {
		path: ['event', 'EventLocationInfo', 'LocationDetails', 'LocationItem', 'Intersections', 'Article']
	},
	'Primary Interception': {
		path: ['event', 'EventLocationInfo', 'LocationDetails', 'LocationItem', 'Intersections', 'PrimaryLoc']
	},
	'Secondary Interception': {
		path: ['event', 'EventLocationInfo', 'LocationDetails', 'LocationItem', 'Intersections', 'SecondaryLoc']
	},
	'Article - Associated Cities': {
		path: ['event', 'EventLocationInfo', 'LocationDetails', 'LocationItem', 'AssociatedCities', 'Article']
	},
	'Primary City': {
		path: ['event', 'EventLocationInfo', 'LocationDetails', 'LocationItem', 'AssociatedCities', 'PrimaryCity']
	},
	'Secondary City': {
		path: ['event', 'EventLocationInfo', 'LocationDetails', 'LocationItem', 'AssociatedCities', 'SecondaryCity']
	},
	'Primary Road Marker': {
		path: ['event', 'EventLocationInfo', 'LocationDetails', 'LocationItem', 'RoadMarkers', 'PrimaryMarker'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Secondary Road Marker': {
		path: ['event', 'EventLocationInfo', 'LocationDetails', 'LocationItem', 'RoadMarkers', 'SecondaryMarker'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Road Marker Units': {
		path: ['event', 'EventLocationInfo', 'LocationDetails', 'LocationItem', 'RoadMarkers', 'Units']
	},
	'Longitude': {
		path: ['event', 'EventLocationInfo', 'LocationDetails', 'LocationItem', 'PointCoordinates', 'Lon'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Latitude': {
		path: ['event', 'EventLocationInfo', 'LocationDetails', 'LocationItem', 'PointCoordinates', 'Lat'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Datum': {
		path: ['event', 'EventLocationInfo', 'LocationDetails', 'LocationItem', 'PointCoordinates', 'Datum']
	},
	'ScheduleID': {
		path: ['event', 'ScheduleInfo', 'Schedules', 'Schedule', 'ScheduleID'],
		type: 'integer',
		notSearchable: true
	},
	'Schedule Lane Details': {
		path: ['event', 'ScheduleInfo', 'Schedules', 'Schedule', 'ScheduleLaneDetails'],
		type: 'integer',
		notSearchable: true
	},
	'Active Days': {
		path: ['event', 'ScheduleInfo', 'Schedules', 'Schedule', 'ActiveDays', 'DayOfWeek'],
		type: 'string'
	},
	'Continuous': {
		path: ['event', 'ScheduleInfo', 'Schedules', 'Schedule', 'Continuous'],
		type: 'boolean'
	},
	'Schedule Start': {
		path: ['event', 'ScheduleInfo', 'Schedules', 'Schedule', 'ScheduleStartDateTime'],
		type: 'date',
		modifiers: ['date'],
		searchableByInterval: true
	},
	'Schedule End': {
		path: ['event', 'ScheduleInfo', 'Schedules', 'Schedule', 'ScheduleEndDateTime'],
		type: 'date',
		modifiers: ['date'],
		searchableByInterval: true
	},
	'Additional Data': {
		path: ['event', 'AdditionalData', 'DataItem'],
		notSearchable: true
	}
};

module.exports.order = [
	'ID',
	'Associated ID',
	'Event Class',
	'Event State',
	'Date Started',
	'Time Left (minutes)',
	'Last Update',
	'Type',
	'Lanes Affected',
	'Lanes Details',
	'Lanes Status',
	'Description',
	'Reporting Organization',
	'Facility',
	'City',
	'State',
	'County',
	'Direction',
	'Comments',
	'Article - Interception',
	'Primary Interception',
	'Secondary Interception',
	'Article - Associated Cities',
	'Primary City',
	'Secondary City',
	'Primary Road Marker',
	'Secondary Road Marker',
	'Road Marker Units',
	'Longitude',
	'Latitude',
	'Datum',
	'ScheduleID',
	'Schedule Lane Details',
	'Active Days',
	'Continuous',
	'Schedule Start',
	'Schedule End',
	'Additional Data'
];

module.exports.db = "mongodb";