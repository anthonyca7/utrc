// +--------------------+----------------+------+-----+---------+----------------+
// | Field              | Type           | Null | Key | Default | Extra          |
// +--------------------+----------------+------+-----+---------+----------------+
// | id                 | bigint(20)     | NO   | PRI | NULL    | auto_increment |
// | event_id           | bigint(20)     | NO   |     | NULL    |                |
// | event_state        | varchar(32)    | YES  |     | NULL    |                |
// | event_class        | varchar(64)    | YES  |     | NULL    |                |
// | event_type         | varchar(128)   | YES  |     | NULL    |                |
// | report_org_id      | varchar(64)    | YES  |     | NULL    |                |
// | facility_name      | varchar(128)   | YES  |     | NULL    |                |
// | direction          | varchar(32)    | YES  |     | NULL    |                |
// | article_code       | varchar(32)    | YES  |     | NULL    |                |
// | from_loc_point     | varchar(192)   | YES  |     | NULL    |                |
// | to_loc_point       | varchar(192)   | YES  |     | NULL    |                |
// | create_time        | datetime       | YES  |     | NULL    |                |
// | last_update        | datetime       | YES  |     | NULL    |                |
// | event_description  | varchar(1024)  | YES  |     | NULL    |                |
// | city               | varchar(64)    | YES  |     | NULL    |                |
// | county             | varchar(32)    | YES  |     | NULL    |                |
// | state              | varchar(2)     | YES  |     | NULL    |                |
// | estimated_duration | int(11)        | YES  |     | NULL    |                |
// | lat                | decimal(16,14) | YES  |     | NULL    |                |
// | lon                | decimal(17,15) | YES  |     | NULL    |                |
// | to_lat             | decimal(16,14) | YES  |     | NULL    |                |
// | to_lon             | decimal(17,15) | YES  |     | NULL    |                |
// | lanes_affected     | smallint(6)    | YES  |     | NULL    |                |
// | lane_status        | varchar(64)    | YES  |     | NULL    |                |
// | total_lanes        | smallint(6)    | YES  |     | NULL    |                |
// | lane_description   | varchar(64)    | YES  |     | NULL    |                |
// | lane_detail        | varchar(64)    | YES  |     | NULL    |                |
// | update_number      | smallint(6)    | YES  |     | NULL    |                |
// | respond_org_id     | varchar(64)    | YES  |     | NULL    |                |
// | pavement_condition | varchar(64)    | YES  |     | NULL    |                |
// | weather_condition  | varchar(64)    | YES  |     | NULL    |                |
// | start_date         | datetime       | YES  |     | NULL    |                |
// | end_date           | datetime       | YES  |     | NULL    |                |
// | event_other_desc   | varchar(256)   | YES  |     | NULL    |                |
// | from_mile_marker   | float          | YES  |     | NULL    |                |
// | to_mile_marker     | float          | YES  |     | NULL    |                |
// | local_only         | tinyint(1)     | YES  |     | NULL    |                |
// | construction_type  | varchar(64)    | YES  |     | NULL    |                |
// | confirmation_code  | varchar(64)    | YES  |     | NULL    |                |
// | closure_type       | smallint(6)    | YES  |     | NULL    |                |
// | hash               | varchar(32)    | NO   | UNI | NULL    |                |
// +--------------------+----------------+------+-----+---------+----------------+


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
	"Event ID": {
		path: ["event_id"],
		type: 'integer',
		searchableByInterval: true
	}, 
	"Event State": {
		path: ["event_state"]
	},
	"Event Class": {
		path: ["event_class"]
	},
	"Event Type": {
		path: ["event_type"]
	},
	"Reporting Organization": {
		path: ["report_org_id"]
	},
	"facility Name": {
		path: ["facility_name"]
	},
	"Direction": {
		path: ["direction"]
	},
	"Article Code": {
		path: ["article_code"]
	},
	"From Location Point": {
		path: ["from_loc_point"]
	},
	"To Location Point": {
		path: ["to_loc_point"]
	},
	"Create Time": {
		path: ["create_time"],
		modifiers: ['date']
		//type: 'date'
		//searchableByInterval: true
	},
	"Last Update": {
		path: ["last_update"],
		modifiers: ['date']
		//type: 'date'
		//searchableByInterval: true
	},
	"Event Description": {
		path: ["event_description"]
	},
	"City": {
		path: ["city"]
	},
	"County": {
		path: ["county"]
	},
	"State": {
		path: ["state"]
	},
	"Estimated Duration": {
		path: ["estimated_duration"],
		type: 'integer',
		searchableByInterval: true
	},
	"Latitude": {
		path: ["lat"],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	"Longitude": {
		path: ["lon"],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	"To Latitude": {
		path: ["to_lat"],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	"To Longitude": {
		path: ["to_lon"],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	"Lanes Affected": {
		path: ["lanes_affected"],
		type: 'integer',
		searchableByInterval: true
	},
	"Lane Status": {
		path: ["lane_status"]
	},
	"Total Lanes": {
		path: ["total_lanes"],
		type: 'integer',
		searchableByInterval: true
	},
	"Lane Description": {
		path: ["lane_description"]
	},
	"Lane Detail": {
		path: ["lane_detail"]
	},
	"Update Number": {
		path: ["update_number"],
		type: 'integer',
		searchableByInterval: true
	},
	"Respond Organization ID": {
		path: ["respond_org_id"]
	},
	"Pavement Condition": {
		path: ["pavement_condition"]
	},
	"Weather Condition": {
		path: ["weather_condition"]
	},
	"Start Date": {
		path: ["start_date"],
		modifiers: ['date']
		//type: 'date'
		//searchableByInterval: true
	},
	"End Date": {
		path: ["end_date"],
		modifiers: ['date']
		//type: 'date'
		//searchableByInterval: true
	},
	"Other Event Description": {
		path: ["event_other_desc"]
	},
	'Starting Filemarker Affected': {
		path: ['from_mile_marker'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Ending Filemarker Affected': {
		path: ['to_mile_marker'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Is Local?': {
		path: ['local_only'],
		type: 'boolean'
	},
	'Construction Type': {
		path: ['construction_type']
	},
	'Confirmation Code': {
		path: ['confirmation_code']
	},
	'Closure Type': {
		path: ['closure_type']
	}

};

module.exports.order = [
	"ID",
	"Event ID",
	"Event State",
	"Event Class",
	"Event Type",
	"Reporting Organization",
	"facility Name",
	"Direction",
	"Article Code",
	"From Location Point",
	"To Location Point",
	"Create Time",
	"Last Update",
	"Event Description",
	"City",
	"County",
	"State",
	"Estimated Duration",
	"Latitude",
	"Longitude",
	"To Latitude",
	"To Longitude",
	"Lanes Affected",
	"Lane Status",
	"Total Lanes",
	"Lane Description",
	"Lane Detail",
	"Update Number",
	"Respond Organization ID",
	"Pavement Condition",
	"Weather Condition",
	"Start Date",
	"End Date",
	"Other Event Description",
	'Starting Filemarker Affected',
	'Ending Filemarker Affected',
	'Is Local?',
	'Construction Type',
	'Confirmation Code',
	'Closure Type'
];


module.exports.db = "mongodb";
module.exports.index = "Category";
