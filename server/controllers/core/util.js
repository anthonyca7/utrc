var mongoose   = require('mongoose')
var Transcom = mongoose.model('Transcom');

//"/api/event/:evt/:page/:limit"

module.exports.transcomEvents = function (req, res, next) {
	var Model = mongoose.model(req.params.evt);

	Model.find({}, {}, { 
		skip:  (req.params.page-1)*(req.params.limit),
		limit: req.params.limit },
	 function(err, data){
	 	if (err) { console.log(err) };
		res.json(data);
	});
}
