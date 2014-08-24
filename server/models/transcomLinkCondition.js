/**
 * Created by anthony on 8/23/14.
 */

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var transcomLinkCondition = new Schema({
	event: {
		type: Schema.Types.Mixed,
		unique: true,
		index: true,
		validate: eventValidation
	}
});


function eventValidation(event, respond) {
	this.constructor.findOne({'event.ID': event.ID}, function (err, evt) {
		if (evt) {
			respond(false);
		}
		else {
			respond(true);
		}
	});
}


mongoose.model('TranscomLinkCondition', transcomLinkCondition);
