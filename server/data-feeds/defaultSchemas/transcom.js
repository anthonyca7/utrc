'use strict';

var fs = require('fs'),
    mongoose = require('mongoose'),
    Feed = mongoose.model('Feed');

module.exports = {
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
  'Intersections': {
    path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'Intersections', 'PrimaryLoc']
  },
  'Longitud': {
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

