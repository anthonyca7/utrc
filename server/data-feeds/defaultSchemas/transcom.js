'use strict';

var fs = require('fs'),
    mongoose = require('mongoose'),
    Feed = mongoose.model('Feed');

module.exports.format = {
  'ID': {
    path: ['EventID']
  },
  'Associated ID': {
    path: ['AssociatedEventID']
  },
  'Class': {
    path: ['EventClass'],
    type: 'integer'
  },
  'Event State': {
    path: ['EventState'],
    type: 'integer'
  },
  'Date Started': {
    path: ['StartDateTime'],
    modifiers: ['date'],
    type: 'date'
  },
  'Time Left (minutes)': {
    path: ['EstDurationInMinutes'],
    type: 'integer'
  },
  'Last Update': {
    path: ['LastUpdate'],
    modifiers: ['date'],
    type: 'date'
  },
  'Type': {
    path: ['EventTypes', 'EventType']
  },
  'Lanes Affected': {
    path: ['LaneDetails', 'LanesAffectedCount'],
    type: 'integer'
  },
  'Lanes Details': {
    path: ['LaneDetails', 'LanesDetail']
  },
  'Lanes Status': {
    path: ['LaneDetails', 'LanesStatus']
  },
  'Description': {
    path: ['SummaryDescription']
  },
  'Reporting Organization': {
    path: ['ReportingOrg'],
    type: 'integer'
  },
  'Facility': {
    path: ['EventLocationInfo', 'Facility']
  },
  'City': {
    path: ['EventLocationInfo', 'City']
  },
  'State': {
    path: ['EventLocationInfo', 'State']
  },
  'County': {
    path: ['EventLocationInfo', 'County']
  },
  'Direction': {
    path: ['EventLocationInfo', 'Direction']
  },
  'Comments': {
    path: ['Comments', 'CommentInfo', 'Comment']
  },
  'Article - Interception': {
    path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'Intersections', 'Article']
  },
  'Primary Interception': {
    path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'Intersections', 'PrimaryLoc']
  },
  'Secondary Interception': {
    path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'Intersections', 'SecondaryLoc']
  },
  'Article - Associated Cities': {
    path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'AssociatedCities', 'Article']
  },
  'Primary City': {
    path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'AssociatedCities', 'PrimaryCity']
  },
  'Secondary City': {
    path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'AssociatedCities', 'SecondaryCity']
  },
  'Primary Road Marker': {
    path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'RoadMarkers', 'PrimaryMarker'],
    type: 'float',
    modifiers: ['float']
  },
  'Secondary Road Marker': {
    path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'RoadMarkers', 'SecondaryMarker'],
    type: 'float',
    modifiers: ['float']
  },
  'Road Marker Units': {
    path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'RoadMarkers', 'Units']
  },
  'Longitude': {
    path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'PointCoordinates', 'Lon'],
    type: 'float',
    modifiers: ['float']
  },
  'Latitude': {
    path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'PointCoordinates', 'Lat'],
    type: 'float',
    modifiers: ['float']
  },
  'Datum': {
    path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'PointCoordinates', 'Datum']
  },
  'ScheduleID': {
    path: ['ScheduleInfo', 'Schedules', 'Schedule', 'ScheduleID'],
    type: 'integer'
  },
  'Schedule Lane Details': {
    path: ['ScheduleInfo', 'Schedules', 'Schedule', 'ScheduleLaneDetails'],
    type: 'integer'
  },

  'Active Days': {
    path: ['ScheduleInfo', 'Schedules', 'Schedule', 'ActiveDays', 'DayOfWeek'],
    type: 'string'
  },
  'Continuous': {
    path: ['ScheduleInfo', 'Schedules', 'Schedule', 'Continuous'],
    type: 'boolean'
  },
  'Schedule Start': {
    path: ['ScheduleInfo', 'Schedules', 'Schedule', 'ScheduleStartDateTime'],
    type: 'date',
    modifiers: ['date']
  },
  'Schedule End': {
    path: ['ScheduleInfo', 'Schedules', 'Schedule', 'ScheduleEndDateTime'],
    type: 'date',
    modifiers: ['date']
  },
  'Additional Data': {
    path: ['AdditionalData', 'DataItem']
  }
};

module.exports.order = [
	'ID',
	'Associated ID',
	'Class',
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