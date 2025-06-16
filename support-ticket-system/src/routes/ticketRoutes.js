// src/routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const {
    createTicket, getTicketById, getTickets, updateTicketStatus, assignTicket,
    addCommentToTicket, getCommentsForTicket // Add new comment handlers
} = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, param } = require('express-validator');

// All routes here are protected and require authentication

// POST /api/tickets - Create a new ticket (CLIENT)
router.post(
  '/',
  authMiddleware('CLIENT'), // Only CLIENT can create
  [
    body('subject').notEmpty().withMessage('Subject is required.'),
    body('description').notEmpty().withMessage('Description is required.'),
    body('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']).withMessage('Invalid priority.'),
  ],
  (req, res, next) => { /* Validation result check */
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }); }
    next();
  },
  createTicket
);

// GET /api/tickets - Get tickets (role-dependent)
router.get('/', authMiddleware(), getTickets); // Any authenticated user

// GET /api/tickets/:id - Get a specific ticket by ID
router.get(
  '/:id',
  authMiddleware(), // Any authenticated user (controller handles specific access logic)
  [param('id').isInt().withMessage('Ticket ID must be an integer.')],
  (req, res, next) => { /* Validation result check */
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }); }
    next();
  },
  getTicketById
);

// PUT /api/tickets/:id/status - Update ticket status (SUPPORT, ADMIN)
router.put(
  '/:id/status',
  authMiddleware(['SUPPORT', 'ADMIN']),
  [
    param('id').isInt().withMessage('Ticket ID must be an integer.'),
    body('status').isIn(['Open', 'In Process', 'Closed', 'Resolved']).withMessage('Invalid status value.')
  ],
  (req, res, next) => { /* Validation result check */
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }); }
    next();
  },
  updateTicketStatus
);

// PUT /api/tickets/:id/assign - Assign ticket to an agent (SUPPORT, ADMIN)
// Note: Typically ADMIN would assign, or a system for auto-assignment.
// SUPPORT might assign to themselves from an unassigned pool.
router.put(
  '/:id/assign',
  authMiddleware(['ADMIN', 'SUPPORT']), // Or just ADMIN if preferred
  [
    param('id').isInt().withMessage('Ticket ID must be an integer.'),
    body('agentId').isInt().withMessage('Agent ID must be an integer.')
  ],
  (req, res, next) => { /* Validation result check */
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }); }
    next();
  },
  assignTicket
);

// POST /api/tickets/:id/comments - Add a comment to a ticket
router.post(
  '/:id/comments',
  authMiddleware(), // Any authenticated user (controller handles specific role logic)
  [
    param('id').isInt().withMessage('Ticket ID must be an integer.'),
    body('comment').notEmpty().withMessage('Comment text is required.'),
    body('isInternalNote').optional().isBoolean().withMessage('isInternalNote must be a boolean.')
  ],
  (req, res, next) => { /* Validation result check */
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }); }
    next();
  },
  addCommentToTicket
);

// GET /api/tickets/:id/comments - Get all comments for a ticket
router.get(
  '/:id/comments',
  authMiddleware(), // Any authenticated user (controller handles specific role logic)
  [param('id').isInt().withMessage('Ticket ID must be an integer.')],
  (req, res, next) => { /* Validation result check */
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }); }
    next();
  },
  getCommentsForTicket
);

module.exports = router;
