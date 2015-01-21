'use strict';

module.exports.format = {
	'ID': {
		path: ['_id'],
	},
	'Text': {
		path: ['text']
	},
	'Name': {
		path: ['user', 'name']
	},
	'Username': {
		path: ['user', 'screen_name']
	},
	'Creation Date': {
		path: ['created_at'],
		type: 'date',
		modifiers: ['date'],
		searchableByInterval: true
	},
	"Language": {
		path: ['lang']
	},
	'Longitude': {
		path: ['lon'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	'Latitude': {
		path: ['lat'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	// 'location': {
	// 	path: ['user', 'location']
	// },
	'Place': {
		path: ['place', 'name']
	},
	'Full Place': {
		path: ['place', 'full_name']
	},
	'Country': {
		path: ['place', 'country']
	},
	'Country Code': {
		path: ['place', 'country_code']
	},
	'Bounding Box': {
		path: ['place', 'bounding_box', 'coordinates']
	}, 
	'User Description': {
		path: ['user', 'description']
	},
	'Source': {
		path: ['source']
	},
	'Truncated': {
		path: ['truncated'],
		type: 'boolean'
	},
	'Protected': {
		path: ['user', 'protected'],
		type: 'boolean'
	},
	'Verified': {
		path: ['user', 'verified'],
		type: 'boolean'
	},
	'Followers': {
		path: ['user', 'followers_count']
	},
	'Friends': {
		path: ['user', 'friends_count']
	},
	'Listed': {
		path: ['user', 'listed_count']
	},
}

module.exports.order = [
	'ID',
	'Text',
	'Name',
	'Username',
	'Creation Date',
	"Language",
	'Longitude',
	'Latitude',
	'Place',
	'Full Place',
	'Country',
	'Country Code',
	'Bounding Box', 
	'User Description',
	'Source',
	'Truncated',
	'Protected',
	'Verified',
	'Followers',
	'Friends',
]

module.exports.db = "mongodb";
