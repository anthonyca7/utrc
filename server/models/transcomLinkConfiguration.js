var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var transcomLinkConfiguration = new Schema({
	event: {
		type: Schema.Types.Mixed,
		unique: true,
		index: true,
		validate: eventValidation
	}
});


function eventValidation(event, respond) {
	this.constructor.findOne({'event.EventID': event.EventID}, function (err, evt) {
		if (evt) {
			respond(false);
		}
		else {
			respond(true);
		}
	});
}


mongoose.model('TranscomLinkConfiguration', transcomLinkConfiguration);