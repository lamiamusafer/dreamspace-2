const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (user) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid username or password' });
    }
});

// Register route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ success: true, message: 'User created successfully' });
});

module.exports = router;
