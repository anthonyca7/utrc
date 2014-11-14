module.exports.format = {
	"ID": {
		path: ['Id'],
		type: 'integer',
		searchableByInterval: true
	},
	"Speed": {
		path: ['Speed'],
		type: 'float',
		modifiers: ['float'],
		searchableByInterval: true
	},
	"Travel Time": {
		path: ['TravelTime'],
		type: 'integer',
		searchableByInterval: true
	},
	"Status": {
		path: ['Status']
	},
	"Date": {
		path: ['DataAsOf'],
		type: 'date',
		modifiers: ['date'],
		searchableByInterval: true
	},
	"Link ID": {
		path: ['linkId'],
		type: 'integer',
		searchableByInterval: true
	},
	"Link Points": {
		path: ['linkPoints'],
		notSearchable: true
	},
	// "Encoded PolyLine": {
	// 	path: ['EncodedPolyLine']
	// },
	// "EncodedPoly Line Lvls": {
	// 	path: ['EncodedPolyLineLvls']
	// },
	"Owner": {
		path: ['Owner']
	},
	"Transcom ID": {
		path: ['Transcom_id'],
		type: 'integer',
		searchableByInterval: true
	},
	"Borough": {
		path: ['Borough']
	},
	"Link Name": {
		path: ['linkName']
	}
};

module.exports.order = [
	"ID",
	"Speed",
	"Travel Time",
	"Status",
	"Date",
	"Link ID",
	"Link Points",
	// "Encoded PolyLine",
	// "EncodedPoly Line Lvls",
	"Owner",
	"Transcom ID",
	"Borough",
	"Link Name"
];

module.exports.db = "mongodb";
module.exports.index = "Id";