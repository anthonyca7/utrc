var mongoose     = require('mongoose'),
	schema       = require('../data-feeds/transcom-schema'),
	_            = require('lodash'),
	excelbuilder = require('msexcel-builder'),
	Transcom     = mongoose.model('Transcom');

module.exports.transcomEvents = function (req, res, next) {
	var Model    = mongoose.model(req.params.evt);
	var criteria = JSON.parse(req.body.criteria);

	Model.find(criteria, {}, { 
		skip:  (req.params.page-1)*(req.params.limit),
		limit: req.params.limit 
	},
	function(err, data){
	 	if (err) { console.log(err) };	
	 	Model.count(criteria, function (err, count) {
	 		if (err) { console.log(err) };	
			res.json({events: data, count: count});
	 	});
	});
}

module.exports.makeTable = function (req, res, next) {
	var Model    = mongoose.model(req.params.evt);

	var criteria = (req.params.cond) ? JSON.parse(req.params.cond):{};
	//var criteria = (req.body.criteria) ? JSON.parse(req.body.criteria):{};

	res.setHeader('Content-disposition', 'attachment; filename=' + "results" + '.txt');
	res.setHeader('Content-type', 'text/plain');
	res.charset = 'UTF-8';

	Model.find(criteria, {}, {},
	function (err, data) {
		if (err) { console.log(err) };
		generateHeaders(req, res, data);
	});
}


function generateHeaders (req, res, data) {
	req.headers = Object.keys(schema);
	generateTable(req, res, data);
}

function generateTable(req, res, data){
	var tmp = {};
	var result = [];
	var count = 0;
	if (!data) {
		return;
	}
	data.forEach(function(doc){
		req.headers.forEach(function (column) {
			var value          = doc['event'],
			    fieldPath      = schema[column].path,
			    fieldModifiers = schema[column].modifiers;
			var newval;
			for(field in fieldPath){
				newval = value[fieldPath[field]];
				if (_.isArray(value)) {
					value.forEach(function (obj) {
						if (obj[fieldPath[field]] != null) {
							value = obj[fieldPath[field]];
						}
					});
				}
				else if (newval != null) {
					value = value[fieldPath[field]];
				}
				else{
					value = null
					break;
				}
			}
			for(modifier in fieldModifiers){
				if (_.isFunction(fieldModifiers[modifier])) {
					value = fieldModifiers[modifier](value);
				}
			}
			
			value = (value != null)?value.toString():value;
			tmp[column] = value;
			res.write((value)?value+",\t": " ,\t");
		});
		result.push(tmp);
		res.write("\n");
		//res.write(JSON.stringify(tmp));
		tmp = {};
	});


	res.end();
	//createExcelFile(result, req, res);
}

/*
function createExcelFile(results, req, res) {
	var workbook = excelbuilder.createWorkbook('./', 'sample.xlsx')
		,length = req.headers.length
		,row, i, j;

  	var sheet1 = workbook.createSheet('sheet1', length, results.length + 2);

  	for (i = 0; i < length; i++) {
  		sheet1.set(i+1, 1, req.headers[i]);
  	}

    for (row = 0; row < results.length; row++) {
    	j = 0;
    	for (columnIndex in results[row]){
		    sheet1.set(j+1, row+2, results[row][columnIndex]);
    		j++;
    	}	
    }

	workbook.save(function(ok){
	  if (!ok) 
	    workbook.cancel();
	  else
		res.sendFile('./sample.xlsx');
	});

	res.end('response is fast');
}*/




