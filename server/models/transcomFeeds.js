var mongoose   = require('mongoose'),
    Schema     = mongoose.Schema,
    fs         = require('fs'),
    _          = require('lodash');


var transcomSchema = Schema({
  event: {
    type:   Schema.Types.Mixed,
    unique: true,
    index: true,
    validate: eventValidation
  }
});


function eventValidation (event, respond) {
  this.constructor.findOne({'event.EventID': event.EventID, 'event.LastUpdate': event.LastUpdate}, function(err, evt){
    if (evt) {
      respond(false);
    }
    else{
      respond(true);
    }
  });
}



mongoose.model('Transcom', transcomSchema);