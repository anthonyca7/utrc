'use strict';

module.exports.format = {
	"Station": {
		path: ['station']
	},
	"borough": {
		path: ['borough']
	},
	"Train Number": {
		path: ['trainno']
	},
	"Equipment": {
		path: ['equipment']
	},
	"Equipment Type": {
		path: ['equipmenttype']
	},
	"Serving": {
		path: ['serving']
	},
	"ADA Compliant?": {
		path: ['ADA']
	},
	"Date": {
		path: ['outagedate']
	},
	"Estimated Return Of Service": {
		path: ['estimatedreturntoservice']
	},
	"Reason": {
		path: ["reason"]
	},
	"Regular Maintance?": {
		path: ['ismaintenanceoutage']
	},
	"For Future Work?": {
		path: ['isupcomingoutage']
	}
};

module.exports.order = [
	"Station",
	"borough",
	"Train Number",
	"Equipment",
	"Equipment Type",
	"Serving",
	"ADA Compliant?",
	"Date",
	"Estimated Return Of Service",
	"Reason",
	"Regular Maintance?",
	"For Future Work?"
];


module.exports.db = "mongodb";