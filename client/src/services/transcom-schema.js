angular.module('webinterface')
	.factory('TRANSCOM_SCHEMA', function (defaultModifiers) {
		return {
			'ID'             : { path: ['EventID'], width: '40' },
			'Associated ID'  : { path: ['AssociatedEventID'], width: '40'},
			'Class'          : { path: ['EventClass'], width: '40'},
			'Event State'          : { path: ['EventState'], width: '40' },
			'Date Started'   : { path: ['StartDateTime'], modifiers: [defaultModifiers.dates], width: '140' },
			'Time Left (minutes)'    : { path: ['EstDurationInMinutes'], width: '80' },
			'Last Update'    : { path: ['LastUpdate'], modifiers: [defaultModifiers.dates], width: '140' },
			'Type'           : { path: ['EventTypes', 'EventType'], modifiers: [defaultModifiers.arrays], width: '100' },
			'Lanes Affected' : { path: ['LaneDetails', 'LanesAffectedCount'], width: '60' },
			'Lanes Details'  : { path: ['LaneDetails', 'LanesDetail'], width: '100' },
			'Lanes Status'   : { path: ['LaneDetails', 'LanesStatus'], width: '70' },
			'Description'    : { path: ['SummaryDescription'], width: '250' },
			'Reporting Organization' : { path: ['ReportingOrg'], width: '100' },
			'Facility'           : { path: ['EventLocationInfo', 'Facility'], width: '100' },
			'City'               : { path: ['EventLocationInfo', 'City'], width: '100' },
			'State'              : { path: ['EventLocationInfo', 'State'], width: '100' },
			'County'             : { path: ['EventLocationInfo', 'County'], width: '100' },
			'Comments'           : { path: ['Comments', 'CommentInfo', 'Comment'], width: '400' },
			'Intersections'      : { path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'Intersections', 'PrimaryLoc']},
			'Longitud'           : { path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'PointCoordinates', 'Lon']},
			'Latitude'           : { path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'PointCoordinates', 'Lat']},
			'Datum'              : { path: ['EventLocationInfo', 'LocationDetails', 'LocationItem', 'PointCoordinates', 'Datum']},
			'Schedule Start'     : { path: ['ScheduleInfo', 'Schedules', 'Schedule', 'ScheduleStartDateTime'], modifiers: [defaultModifiers.dates], width: '140' },
			'Schedule End'       : { path: ['ScheduleInfo', 'Schedules', 'Schedule', 'ScheduleEndDateTime'], modifiers: [defaultModifiers.dates], width: '140' }
		}
	});

