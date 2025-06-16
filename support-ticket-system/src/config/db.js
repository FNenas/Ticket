// src/config/db.js
const { Pool } = require('pg');
// No need to call dotenv.config here if already done in envLoader.js and loaded in index.js before this runs.
// However, to make this module independently loadable if needed, or if load order is uncertain,
// it's safer to include it, especially during initial setup.
// The path needs to be relative to THIS file (src/config/db.js) to find .env in the root.
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database!');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // Export pool if needed for transactions
};
