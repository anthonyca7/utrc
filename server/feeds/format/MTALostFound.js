'use strict';

module.exports.format = {
	"Category": {
		path: ["Category"]
	},
	"SubCategory": {
		path: ["SubCategory"],
		notSearchable: true
	}
};

module.exports.order = [
	"Category",
	"SubCategory"
];


module.exports.db = "mongodb";
module.exports.index = "Category";
