angular.module('webinterface')
	.factory('TRANSCOM_SCHEMA', function (helpers) {
		return {
			'ID'             : { path: ['EventID'], searchFun: helpers.stringreg, width: '40' },
			'Associated ID'  : { path: ['AssociatedEventID'], searchFun: helpers.stringreg, width: '40'},
			'Class'          : { path: ['EventClass'], searchFun: helpers.intSearch, interval: helpers.intervalMaker, width: '40'},
			'Event State'          : { path: ['EventState'], searchFun: helpers.intSearch, interval: helpers.intervalMaker, width: '40' },
			'Date Started'   : { path: ['StartDateTime'], modifiers: [helpers.dates], interval: helpers.intervalMaker, secfun: helpers.stringreg, width: '140' },
			'Time Left (minutes)'    : { path: ['EstDurationInMinutes'], searchFun: helpers.intSearch, interval: helpers.intervalMaker, width: '80' },
			'Last Update'    : { path: ['LastUpdate'], modifiers: [helpers.dates],  searchFun: helpers.stringreg, width: '140' },
			'Type'           : { path: ['EventTypes', 'EventType'], modifiers: [helpers.arrays], searchFun: helpers.stringreg, width: '100' },
			'Lanes Affected' : { path: ['LaneDetails', 'LanesAffectedCount'], searchFun: helpers.intSearch, interval: helpers.intervalMaker, width: '60' },
			'Lanes Details'  : { path: ['LaneDetails', 'LanesDetail'], searchFun: helpers.stringreg, width: '100' },
			'Lanes Status'   : { path: ['LaneDetails', 'LanesStatus'], searchFun: helpers.stringreg, width: '70' },
			'Description'    : { path: ['SummaryDescription'], searchFun: helpers.stringreg, width: '250' },
			'Reporting Organization' : { path: ['ReportingOrg'], searchFun: helpers.intSearch, interval: helpers.intervalMaker, width: '100' },
			'Facility'           : { path: ['EventLocationInfo', 'Facility'], searchFun: helpers.stringreg, width: '100' },
			'City'               : { path: ['EventLocationInfo', 'City'], searchFun: helpers.stringreg, width: '100' },
			'State'              : { path: ['EventLocationInfo', 'State'], searchFun: helpers.stringreg, width: '100' },
			'County'             : { path: ['EventLocationInfo', 'County'], searchFun: helpers.stringreg, width: '100' },
			'Comments'           : { path: ['Comments', 'CommentInfo', 'Comment'], searchFun: helpers.stringreg, width: '400' },
			'Intersections'      : { path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'Intersections', 'PrimaryLoc'], searchFun: helpers.stringreg},
			'Longitud'           : { path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'PointCoordinates', 'Lon'],  searchFun: helpers.stringreg},
			'Latitude'           : { path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'PointCoordinates', 'Lat'],  searchFun: helpers.stringreg},
			'Datum'              : { path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'PointCoordinates', 'Datum'], searchFun: helpers.stringreg},
			'Schedule Start'     : { path: ['ScheduleInfo', 'Schedules', 'Schedule', 'ScheduleStartDateTime'], modifiers: [helpers.dates], searchFun: helpers.stringreg, interval: helpers.intervalMaker, width: '140' },
			'Schedule End'       : { path: ['ScheduleInfo', 'Schedules', 'Schedule', 'ScheduleEndDateTime'], modifiers: [helpers.dates], searchFun: helpers.stringreg,interval: helpers.intervalMaker, width: '140' }
		}
	});

