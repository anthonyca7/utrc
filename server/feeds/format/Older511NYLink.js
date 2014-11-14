// +---------------------+--------------+------+-----+---------+----------------+
// | Field               | Type         | Null | Key | Default | Extra          |
// +---------------------+--------------+------+-----+---------+----------------+
// | id                  | bigint(20)   | NO   | PRI | NULL    | auto_increment |
// | LINK_ID             | bigint(20)   | NO   |     | NULL    |                |
// | CURRENT_SPEED       | mediumint(9) | NO   |     | NULL    |                |
// | CURRENT_TRAVEL_TIME | int(11)      | NO   |     | NULL    |                |
// | LAST_UPDATE         | datetime     | NO   |     | NULL    |                |
// | hash                | varchar(32)  | NO   | UNI | NULL    |                |
// +---------------------+--------------+------+-----+---------+----------------+

// older_NY511FEED_events
// older_NY511FEED_linkconditions
// older_NY511FEED_linkinventory
// older_NY511FEED_links
// older_NY511FEED_wtastatus


'use strict';

module.exports.format = {
	"ID": {
		path: ["id"],
		type: 'integer',
		searchableByInterval: true
	},
	"Link ID": {
		path: ["LINK_ID"],
		type: 'integer',
		searchableByInterval: true
	},
	"Current Speed": {
		path: ["CURRENT_SPEED"],
		type: 'integer',
		searchableByInterval: true
	},
	"Current Travel Time": {
		path: ["CURRENT_TRAVEL_TIME"],
		type: 'integer',
		searchableByInterval: true
	},
	"Last Update": {
		modifiers: ['date']
		//type: 'date'
		//searchableByInterval: true
	}
}

module.exports.order = [
	"ID",
	"Link ID",
	"Current Speed",
	"Current Travel Time",
	"Last Update"
];

module.exports.db = "mongodb";
