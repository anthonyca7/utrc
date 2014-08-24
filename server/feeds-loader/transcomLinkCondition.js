/**
 * Created by anthony on 8/23/14.
 */

var request = require("request"),
parser = require('xml2json'),
fs = require('fs'),
http = require('http');

var mongoose = require('mongoose'),
    LinkCondition = mongoose.model('TranscomLinkCondition');

function loadEvents() {
	var allEventsUrl = "https://data.xcmdata.org/ISGDE/rest/linkProvider/getXmitLinkConditions?System=anthonyca7&Key=transcom";

	request({url: allEventsUrl}, function (err, response, body) {
		if (err) {
			console.log(err.message);
			return;
		}

		var json = JSON.parse(parser.toJson(body, function (err) {
			console.log(err);
		}));

		var events = json["ns:getDataResponse"]["return"]["dataResponse"]["linkConditions"]["linkCondition"];

		for (var i = 0; i < events.length; i++) {
			(function (index) {
				LinkCondition.create({event: events[index]}, function (p) {});
			})(i);
		}
	});
}

loadEvents();
setInterval(loadEvents, 60000);
