require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./utils/errorHandler');

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/reviews', require('./routes/reviews'));

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
