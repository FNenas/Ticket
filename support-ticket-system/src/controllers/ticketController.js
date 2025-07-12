// src/controllers/ticketController.js
const Ticket = require('../models/Ticket');
const User = require('../models/User'); // To check agent role before assignment
const TicketComment = require('../models/TicketComment');
const {
    notifyNewTicketCreation,
    notifyTicketAssignment,
    notifyNewComment,
    notifyTicketStatusChange
} = require('../services/notificationService'); // Add this

// Client: Create a new ticket
exports.createTicket = async (req, res) => {
  const { subject, description, priority } = req.body;
  const clientUserId = req.user.id; // From authMiddleware

  try {
    if (!subject || !description) {
        return res.status(400).json({ message: 'Subject and description are required.' });
    }
    const ticketPriority = priority || 'Medium'; // Default priority
    const ticket = await Ticket.create(subject, description, ticketPriority, clientUserId);

    if (ticket) {
        notifyNewTicketCreation(ticket.id).catch(err => console.error("notifyNewTicketCreation failed:", err));
    }
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).send('Server error while creating ticket.');
  }
};

// All roles: Get ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Role-based access: Client can only see their own tickets
    // Support can see assigned or unassigned, Admin can see all
    if (req.user.role === 'CLIENT' && ticket.client_user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to this ticket.' });
    }
    // Further checks for SUPPORT role can be added if they should only see their assigned tickets vs all open ones

    res.json(ticket);
  } catch (error) {
    console.error('Get ticket by ID error:', error);
    res.status(500).send('Server error.');
  }
};

// Add a new comment to a ticket
exports.addCommentToTicket = async (req, res) => {
  const { comment, isInternalNote } = req.body;
  const ticketId = req.params.id;
  const userId = req.user.id; // From authMiddleware
  const userRole = req.user.role;

  try {
    if (!comment) {
        return res.status(400).json({ message: 'Comment text is required.' });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Authorization:
    // Client can only comment on their own tickets and cannot make internal notes.
    if (userRole === 'CLIENT') {
      if (ticket.client_user_id !== userId) {
        return res.status(403).json({ message: 'Access denied: You can only comment on your own tickets.' });
      }
      if (isInternalNote) {
        return res.status(403).json({ message: 'Clients cannot create internal notes.' });
      }
    }
    // Support can comment on any ticket (especially assigned ones, or if admin allows broader access)
    // Admin can comment on any ticket.
    // Support/Admin can mark as internal.
    const internalNote = (userRole === 'SUPPORT' || userRole === 'ADMIN') ? (isInternalNote || false) : false;

    const newComment = await TicketComment.create(ticketId, userId, comment, internalNote);
    if (newComment) {
        // Pass commenterId (userId) to potentially avoid self-notification in service
        notifyNewComment(newComment.id, ticketId, userId).catch(err => console.error("notifyNewComment failed:", err));
    }
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).send('Server error while adding comment.');
  }
};

// Get all comments for a ticket
exports.getCommentsForTicket = async (req, res) => {
  const ticketId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const ticket = await Ticket.findById(ticketId); // Check if ticket exists
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Authorization for viewing comments:
    // Client can only view comments on their own tickets.
    if (userRole === 'CLIENT' && ticket.client_user_id !== userId) {
      return res.status(403).json({ message: 'Access denied: You can only view comments on your own tickets.' });
    }
    // Support can view comments on tickets they are assigned to or all (depending on policy).
    // Admin can view all comments.
    // The model method `TicketComment.findByTicketId` already filters internal notes for CLIENT role.

    const comments = await TicketComment.findByTicketId(ticketId, userRole);
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).send('Server error while retrieving comments.');
  }
};

// Get tickets based on role
exports.getTickets = async (req, res) => {
  try {
    let tickets;
    if (req.user.role === 'CLIENT') {
      tickets = await Ticket.findByClientId(req.user.id);
    } else if (req.user.role === 'SUPPORT') {
      // SUPPORT can see tickets assigned to them, or all unassigned/open ones.
      // This could be refined e.g. /api/tickets/assigned or /api/tickets/unassigned
      tickets = await Ticket.findAll(); // Simplified for now: support sees all like admin
                                       // Or: tickets = await Ticket.findByAssignedAgentId(req.user.id);
    } else if (req.user.role === 'ADMIN') {
      tickets = await Ticket.findAll();
    } else {
      return res.status(403).json({ message: 'Invalid role for this operation.' });
    }
    res.json(tickets);
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).send('Server error.');
  }
};

// Support/Admin: Update ticket status
exports.updateTicketStatus = async (req, res) => {
  const { status } = req.body;
  const ticketId = req.params.id;
  const validStatuses = ['Open', 'In Process', 'Closed', 'Resolved'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid or missing status. Must be one of: ' + validStatuses.join(', ') });
  }

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }
    // Potentially add check: if user is SUPPORT, are they assigned to this ticket?
    // For now, any SUPPORT or ADMIN can change status.
    const oldStatus = ticket.status; // Capture status before update

    const updatedTicket = await Ticket.updateStatus(ticketId, status);
    if (updatedTicket) {
        notifyTicketStatusChange(updatedTicket.id, oldStatus).catch(err => console.error("notifyTicketStatusChange failed:", err));
    }
    res.json(updatedTicket);
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).send('Server error.');
  }
};

// Admin/Support: Assign ticket to an agent
exports.assignTicket = async (req, res) => {
  const { agentId } = req.body; // ID of the SUPPORT user
  const ticketId = req.params.id;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'SUPPORT') {
      return res.status(400).json({ message: 'Invalid agent ID or user is not a support agent.' });
    }

    const assignedTicket = await Ticket.assignAgent(ticketId, agentId);
    if (assignedTicket && assignedTicket.assigned_to_user_id) {
        notifyTicketAssignment(assignedTicket.id).catch(err => console.error("notifyTicketAssignment failed:", err));
    }
    res.json(assignedTicket);
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).send('Server error.');
  }
};
