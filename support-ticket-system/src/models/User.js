// src/models/User.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async create(name, email, password, role = 'CLIENT', phoneNumber = null) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const sql = `
      INSERT INTO Users (name, email, password_hash, role, phone_number)
      VALUES (?, ?, ?, ?, ?);
    `;
    const values = [name, email, passwordHash, role, phoneNumber];
    try {
      const result = await db.query(sql, values);
      // For mysql2, the 'rows' from db.query is the result object from execute,
      // which contains insertId for INSERT statements.
      const insertId = result.rows.insertId;
      if (!insertId) {
        // This check might be too strict if insertId can be 0 (though unlikely for AUTO_INCREMENT)
        // However, if insertId is truly absent or undefined, it's an issue.
        throw new Error('User creation failed, no insertId returned or insertId is invalid.');
      }
      // Fetch the created user since MySQL INSERT doesn't have RETURNING *
      return this.findById(insertId);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async findByEmail(email) {
    const sql = 'SELECT * FROM Users WHERE email = ?;';
    try {
      const { rows } = await db.query(sql, [email]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  async findById(id) {
    const sql = 'SELECT id, name, email, role, phone_number, created_at, updated_at FROM Users WHERE id = ?;';
    try {
      const { rows } = await db.query(sql, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }
  // Add other methods if they exist and need changes
};

module.exports = User;
