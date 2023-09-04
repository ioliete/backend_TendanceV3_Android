const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    messages:[{
        idSenter:{ type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        message: String,
        date: Date
    }],
    
});

const Conversation = mongoose.model('conversation', conversationSchema);

module.exports = Conversation;