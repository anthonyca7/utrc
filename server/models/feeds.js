'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FeedSchema = new Schema({
	name: {
		type: String,
		unique: true
	},
	format: {
		type: Schema.Types.Mixed
	},
	order: {
		type: Schema.Types.Mixed
	},
	database: {
		type: String
	}
});

module.exports = mongoose.model('Feed', FeedSchema);