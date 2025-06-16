// src/models/User.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async create(name, email, password, role = 'CLIENT', phoneNumber = null) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const query = `
      INSERT INTO Users (name, email, password_hash, role, phone_number)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, phone_number, created_at;
    `;
    const values = [name, email, passwordHash, role, phoneNumber];
    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async findByEmail(email) {
    const query = 'SELECT * FROM Users WHERE email = $1;';
    try {
      const { rows } = await db.query(query, [email]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  async findById(id) {
    const query = 'SELECT id, name, email, role, phone_number FROM Users WHERE id = $1;';
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }
};

module.exports = User;
