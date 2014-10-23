// +-----------------+---------------+------+-----+---------+----------------+
// | Field           | Type          | Null | Key | Default | Extra          |
// +-----------------+---------------+------+-----+---------+----------------+
// | id              | bigint(20)    | NO   | PRI | NULL    | auto_increment |
// | LINK_ID         | int(11)       | NO   |     | NULL    |                |
// | LAST_UPDATE     | datetime      | NO   |     | NULL    |                |
// | OVERALL_STATUS  | varchar(1024) | NO   |     | NULL    |                |
// | WEATHER_STATUS  | varchar(1024) | NO   |     | NULL    |                |
// | PAVEMENT_STATUS | varchar(1024) | NO   |     | NULL    |                |
// | hash            | varchar(32)   | NO   | UNI | NULL    |                |
// +-----------------+---------------+------+-----+---------+----------------+

// older_NY511FEED_events
// older_NY511FEED_linkconditions
// older_NY511FEED_linkinventory
// older_NY511FEED_links
// older_NY511FEED_wtastatus

'use strict';

module.exports.format = {
	'id': {
		path: ['id'],
		type: 'integer',
		searchableByInterval: true
	},
	'Link ID': {
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
	'Link ID',
	'Last Update',
	'Overall Status',
	'Pavement Status',
	'Weather Status'
];

module.exports.db = "mongodb";
