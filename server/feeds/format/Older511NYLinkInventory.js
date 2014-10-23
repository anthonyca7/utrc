// +----------------+---------------------+------+-----+---------+----------------+
// | id             | bigint(20) unsigned | NO   | PRI | NULL    | auto_increment |
// | linkid         | int(11)             | NO   |     | NULL    |                |
// | status         | int(11)             | NO   |     | NULL    |                |
// | direction      | varchar(8)          | NO   |     | NULL    |                |
// | road_name      | varchar(128)        | NO   |     | NULL    |                |
// | from_road_name | varchar(128)        | NO   |     | NULL    |                |
// | to_road_name   | varchar(128)        | NO   |     | NULL    |                |
// | lane_cnt       | int(11)             | NO   |     | NULL    |                |
// | shoulder_cnt   | int(11)             | NO   |     | NULL    |                |
// | speed_limit    | int(11)             | NO   |     | NULL    |                |
// | length         | int(11)             | NO   |     | NULL    |                |
// | start_lat      | double              | NO   |     | NULL    |                |
// | start_lon      | double              | NO   |     | NULL    |                |
// | end_lat        | double              | NO   |     | NULL    |                |
// | end_lon        | double              | NO   |     | NULL    |                |
// | hash           | varchar(32)         | NO   | UNI | NULL    |                |
// +----------------+---------------------+------+-----+---------+----------------+

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
		path: ["linkid"],
		type: 'integer',
		searchableByInterval: true
	},
	"Status": {
		path: ["status"],
		type: 'integer',
		searchableByInterval: true
	},
	"Direction": {
		path: ["direction"]
	},
	"Road Name": {
		path: ["road_name"]
	},
	"From Road Name": {
		path: ["from_road_name"]
	},
	"To Road Name": {
		path: ["to_road_name"]
	},
	"Lane Count": {
		path: ["lane_cnt"],
		type: 'integer',
		searchableByInterval: true
	},
	"Shoulder Count": {
		path: ["shoulder_cnt"],
		type: 'integer',
		searchableByInterval: true
	},
	"Speed Limit": {
		path: ["speed_limit"],
		type: 'integer',
		searchableByInterval: true
	},
	"Length": {
		path: ["length"],
		type: 'integer',
		searchableByInterval: true
	},
	"Start Latitude": {
		path: ["start_lat"],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	"Start Longitude": {
		path: ["start_lon"],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	"End Latitude": {
		path: ["end_lat"],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	"End Longitude": {
		path: ["end_lon"],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	}  
}

module.exports.order = [
	"ID",
	"Link ID",
	"Status",
	"Direction",
	"Road Name",
	"From Road Name",
	"To Road Name",
	"Lane Count",
	"Shoulder Count",
	"Speed Limit",
	"Length",
	"Start Latitude",
	"Start Longitude",
	"End Latitude",
	"End Longitude"
];

module.exports.db = "mongodb";



