var mongoose   = require('mongoose')
var Transcom = mongoose.model('Transcom');


module.exports.transcomEvents = function (req, res, next) {
	var Model = mongoose.model(req.params.evt);
	console.log(req.body.criteria);

	Model.find(JSON.parse(req.body.criteria), {}, { 
		skip:  (req.params.page-1)*(req.params.limit),
		limit: req.params.limit },
	 function(err, data){
	 	if (err) { console.log(err) };	
	 	Model.count({}, function (err, count) {
	 		if (err) { console.log(err) };	
			res.json({events: data, count: count});
	 	});
	});
}






























	 	/*Date.prototype.format = function(format){
			var o = {
			  "M+" : this.getMonth()+1, //month
			  "d+" : this.getDate(),    //day
			  "h+" : this.getHours(),   //hour
			  "m+" : this.getMinutes(), //minute
			  "s+" : this.getSeconds(), //second
			  "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
			  "S" : this.getMilliseconds() //millisecond
			}
		    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
		      (this.getFullYear()+"").substr(4 - RegExp.$1.length));
		    for(var k in o)if(new RegExp("("+ k +")").test(format))
		      format = format.replace(RegExp.$1,
		        RegExp.$1.length==1 ? o[k] :
		          ("00"+ o[k]).substr((""+ o[k]).length));
		    return format;
		}

	 	data.forEach(function(event){
	 		var attr = ['StartDateTime']
	 		if (event.event.StartDateTime) {
	 			event.event.StartDateTime = new Date(event.event.StartDateTime).format("yyyy-MM-dd h:mm:ss");
	 		};
	 	});*/
