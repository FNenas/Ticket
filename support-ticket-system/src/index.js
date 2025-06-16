// src/index.js
require('./config/envLoader'); // Load environment variables first

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes'); // Add this
const db = require('./config/db'); // To initialize pool and log connection (as per instructions)

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  res.send('Support Ticket System API');
});

app.use('/api/auth', authRoutes); // Mount auth routes
app.use('/api/tickets', ticketRoutes); // Mount ticket routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
