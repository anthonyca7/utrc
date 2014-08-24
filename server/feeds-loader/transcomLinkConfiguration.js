var request = require("request"),
    parser = require('xml2json'),
    fs = require('fs'),
    http = require('http');

var mongoose = require('mongoose'),
    LinkConfiguration = mongoose.model('TranscomLinkConfiguration');

function loadEvents() {
	var allEventsUrl = "https://data.xcmdata.org/ISGDE/rest/linkProvider/getXmitLinkMaster?System=anthonyca7&Key=transcom";

	request({url: allEventsUrl}, function (err, response, body) {
		if (err) {
			console.log(err.message);
			return;
		}

		var json = JSON.parse(parser.toJson(body, function (err) {
			console.log(err);
		}));

		var events = json["ns:getDataResponse"]["return"]["dataResponse"]["linkInventory"]["link"];

		for (var i = 0; i < events.length; i++) {
			(function (index) {
				LinkConfiguration.create({event: events[index]}, function (p) {
				});
			})(i);
		}
	});
}

loadEvents();
setInterval(loadEvents, process.env.TIMEOUT || 86400000);