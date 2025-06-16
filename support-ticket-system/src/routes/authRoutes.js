// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, requestPasswordReset, resetPassword } = require('../controllers/authController');
const { body } = require('express-validator'); // For validation

// Install express-validator: npm install express-validator (already done)
router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    body('role', 'Role must be one of ADMIN, SUPPORT, CLIENT').optional().isIn(['ADMIN', 'SUPPORT', 'CLIENT']),
    body('phoneNumber', 'Phone number must be a valid phone number').optional().isMobilePhone()
  ],
  (req, res, next) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  register
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  (req, res, next) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  login // Use the login controller
);

router.post('/request-password-reset',
  [ body('email', 'Please include a valid email').isEmail() ],
  (req, res, next) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  requestPasswordReset
);

router.post('/reset-password',
  [
    body('token', 'Token is required').not().isEmpty(),
    body('newPassword', 'New password must be 6 or more characters').isLength({ min: 6 })
  ],
  (req, res, next) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  resetPassword
);

module.exports = router;
