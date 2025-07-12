// src/config/envLoader.js
// Corrected path for .env file from src/config directory
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
