angular.module('webinterface')
	.factory('TRANSCOM_SCHEMA', function (defaultModifiers) {
		return {
			'ID'             : { path: ['EventID'] },
			'Associated ID'  : { path: ['AssociatedEventID'] },
			'Class'          : { path: ['EventClass'] },
			'Event State'          : { path: ['EventState'] },
			'Date Started'   : { path: ['StartDateTime'], modifiers: [defaultModifiers.dates] },
			'Time Left (minutes)'    : { path: ['EstDurationInMinutes'] },
			'Last Update'    : { path: ['LastUpdate'], modifiers: [defaultModifiers.dates] },
			'Type'           : { path: ['EventTypes', 'EventType'], modifiers: [defaultModifiers.arrays] },
			'Lanes Affected' : { path: ['LaneDetails', 'LanesAffectedCount'] },
			'Lanes Details'  : { path: ['LaneDetails', 'LanesDetail'] },
			'Lanes Status'   : { path: ['LaneDetails', 'LanesStatus'] },
			'Description'    : { path: ['SummaryDescription'] },
			'Reporting Organization' : { path: ['ReportingOrg'] },
			'Facility'       : { path: ['EventLocationInfo', 'Facility'] },
			'City'           : { path: ['EventLocationInfo', 'City'] },
			'State'          : { path: ['EventLocationInfo', 'State'] },
			'County'         : { path: ['EventLocationInfo', 'County'] },
			'Comments'       : { path: ['Comments', 'CommentInfo', 'Comment'] }
		}
	});

	//	['EventLocationInfo', 'LocationDetails'],