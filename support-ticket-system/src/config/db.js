// src/config/db.js
const mysql = require('mysql2/promise'); // Using promise wrapper
// Correct path from src/config to root .env file
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '3306', 10), // Ensure port is a number
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test the connection (optional, but good for immediate feedback)
pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to the MySQL database!');
    connection.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error('Error connecting to MySQL database:', err.message); // Log only message for cleaner startup
    // Consider exiting if DB connection is critical for startup
    // process.exit(1);
  });

// Export a query function that gets a connection from the pool
module.exports = {
  query: async (sql, params) => {
    const connection = await pool.getConnection();
    try {
      // MySQL uses '?' as placeholders, not '$1', '$2', etc.
      // The mysql2 library handles params array directly for '?'
      const [rows, fields] = await connection.execute(sql, params);
      return { rows, fields }; // Standardize to return object with rows
    } finally {
      connection.release(); // Always release the connection
    }
  },
  pool // Export pool if direct access is needed (e.g., for transactions)
};
