// src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

exports.register = async (req, res) => {
  const { name, email, password, role, phoneNumber } = req.body;

  try {
    // Check if user already exists
    let user = await User.findByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Validate role (optional, can be enforced at DB level too)
    const allowedRoles = ['ADMIN', 'SUPPORT', 'CLIENT'];
    const userRole = (role && allowedRoles.includes(role.toUpperCase())) ? role.toUpperCase() : 'CLIENT';

    user = await User.create(name, email, password, userRole, phoneNumber);

    // Create JWT Payload
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // Token expiration
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token, userId: user.id, name: user.name, role: user.role });
      }
    );
  } catch (error) {
    console.error('Registration error:', error.message);
    if (error.code === '23505') { // Unique constraint violation (e.g. email or phone_number)
        if (error.constraint === 'users_email_key') {
             return res.status(400).json({ message: 'User already exists with this email.' });
        }
        if (error.constraint === 'users_phone_number_key') {
             return res.status(400).json({ message: 'This phone number is already registered.' });
        }
    }
    res.status(500).send('Server error during registration.');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials (email not found).' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials (password incorrect).' });
    }

    // Create JWT Payload
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // Token expiration
      (err, token) => {
        if (err) throw err;
        res.json({ token, userId: user.id, name: user.name, role: user.role });
      }
    );
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).send('Server error during login.');
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      // Still send a success-like message to prevent email enumeration
      return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }
    // TODO:
    // 1. Generate a unique, short-lived token (e.g., crypto.randomBytes)
    // 2. Store this token in the Users table (new column `reset_password_token`, `reset_password_expires`) or a separate table.
    // 3. Send an email to the user with a link like /reset-password?token=<token>
    console.log(`Password reset requested for ${email}. Token generation and email sending not yet implemented.`);
    res.status(200).json({ message: 'Password reset process initiated. Check email (not really, this is a stub).' });
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).send('Server error.');
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  // TODO:
  // 1. Validate token: Find user by `reset_password_token` and check expiry.
  // 2. If valid, hash `newPassword` and update user's `password_hash`.
  // 3. Invalidate the token (set to null or delete).
  console.log(`Password reset attempted with token ${token}. Not yet implemented.`);
  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required.' });
  }
  if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }
  // Placeholder for actual logic
  res.status(200).json({ message: 'Password has been reset (not really, this is a stub).' });
};
