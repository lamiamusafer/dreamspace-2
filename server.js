const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');

const cors = require('cors');
const app = express();

app.use(cors());

const port = 5050;  // Change the port number if necessary

// Middleware to parse JSON data
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/buddyHub', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB!'))
  .catch(error => console.log('Error connecting to MongoDB:', error));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to Buddy Hub API');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
