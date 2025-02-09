const express = require('express');
const Message = require('../models/message');
const router = express.Router();

// Send a message route
router.post('/send', async (req, res) => {
    const { sender, recipient, messageText } = req.body;

    if (!sender || !recipient || !messageText) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const message = new Message({ sender, recipient, messageText });
    await message.save();

    res.json({ success: true, message: 'Message sent successfully' });
});

// Get messages for a user
router.get('/messages/:username', async (req, res) => {
    const { username } = req.params;

    const messages = await Message.find({ $or: [{ sender: username }, { recipient: username }] })
                                  .sort({ timestamp: -1 });

    res.json({ success: true, messages });
});

module.exports = router;
