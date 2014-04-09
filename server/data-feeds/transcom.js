var request    = require("request"),
	parser     = require('xml2json'),
	fs         = require('fs'),
	http       = require('http'),
	mongoose   = require('mongoose'),
  Schema     = mongoose.Schema;

var Transcom = mongoose.model('Transcom');


function loadEvents() {
  var allEventsUrl = "http://data.xcmdata.org/ISGDE/rest/eventProvider/getAllNativeEvents?System=anthonyca7&Key=Asdfghjkl!";

  request({url: allEventsUrl}, function(err, response, body) {
  	if(err) { console.log(err.message); return; }

    var rowsInserted = 0;

  	var json = JSON.parse(parser.toJson(body, function(err){
      console.log(err);
    }));
  	var events = json.eventUpdates.eventUpdate;

  	events.forEach(function (event) {
  		var tEvent = new Transcom({event: event});
  		tEvent.save(function(){
  			rowsInserted++;
  		});
  	});

  	console.log(rowsInserted + " rows inserted for transcom events data");
  });
};

loadEvents();
setInterval(loadEvents, process.env.TIMEOUT || 600000);