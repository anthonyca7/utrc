var mongoose   = require('mongoose'),
    Schema     = mongoose.Schema
    _          = require('lodash');

var transcomSchema = Schema({
	event: {
		type:   Schema.Types.Mixed,
		unique: true,
        index: true
	}
});

transcomSchema
	.path('event')
	.validate(function (event, respond) {
		var keys = {},
			self = this;
		for (var key in event) {
		  keys.key = event.key
		}
		this.constructor.findOne(keys, function(err, evt){
			if (err) throw err;
			if (evt) {
				if(self.event.EventID === evt.event.EventID){
					console.log(evt.event.EventID + "\n\n\n");
					console.log(evt);
					return respond(true);
				}
				return respond(false);
			};
			respond(true);
		});
	});

mongoose.model('Transcom', transcomSchema);