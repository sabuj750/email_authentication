const express = require('express');
const cors = require('cors');

const app = express();

// Update CORS configuration
const allowedOrigins = ['https://correct-frontend-url.com', 'https://another-frontend-url.com'];
app.use(cors({ origin: allowedOrigins }));

// Remaining server code...

module.exports = app;