const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
	creatorName: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
	eventName: String,
    type: String,
    date: Date,
    hourStart: Date,
    hourEnd: Date,
    address: String,
    latitude: Number,
    longitude: Number,
    price: Number,
    website: String,
    description: String,
    eventCover: String,
    users: {
        interUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        partUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    },
});

const Event = mongoose.model('events', eventSchema);

module.exports = Event;