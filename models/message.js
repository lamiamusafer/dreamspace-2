const mongoose = require('mongoose');

// Message schema to define message structure
const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    messageText: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
