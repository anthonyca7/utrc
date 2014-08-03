var request = require("request"),
    parser = require('xml2json'),
    fs = require('fs'),
    http = require('http'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Transcom = mongoose.model('Transcom');
var Feed = mongoose.model('Feed');

function loadEvents() {
    var allEventsUrl = "http://data.xcmdata.org/ISGDE/rest/eventProvider/getAllNativeEvents?System=anthonyca7&Key=Asdfghjkl!";
    var i;

    request({url: allEventsUrl}, function (err, response, body) {
        if (err) {
            console.log(err.message);
            return;
        }

        var rowsInserted = 0;
        var json = JSON.parse(parser.toJson(body, function (err) {
            console.log(err);
        }));

        var events = json.eventUpdates.eventUpdate;

        for (i=0;i<events.length;i++){
          (function (index) {
            Transcom.create({event: events[index]}, function (p) {
            });
          })(i);
        }

      console.log("Inserting feed data for transcom");

    });
}

loadEvents();
setInterval(loadEvents, process.env.TIMEOUT || 600000);