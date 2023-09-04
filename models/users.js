const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	username: String,
	password: String,
    token: String,
    email: String,
    profilePic: String,
    coverPic: String,
    events: {
        interEvents:[{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
        partEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
    },
});

const User = mongoose.model('users', userSchema);

module.exports = User;