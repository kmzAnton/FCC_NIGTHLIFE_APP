var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  eventName: String,
  eventId: String,
  attenders: Array,
  regDate: Date
});

var nightEvent = mongoose.model('Event', eventSchema);

module.exports = nightEvent;