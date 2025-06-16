// src/services/notificationService.js
const { sendEmail } = require('./emailService');
const User = require('../models/User'); // To fetch user details for emails
const Ticket = require('../models/Ticket'); // To fetch ticket details

// Ensure FRONTEND_URL is loaded, if not already by another service/entry point
// require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
// Assuming process.env.FRONTEND_URL and process.env.ADMIN_EMAIL_NOTIFICATIONS are available

const SITE_URL = process.env.FRONTEND_URL || 'http://localhost:3001'; // Define your frontend URL

const notifyNewTicketCreation = async (ticketId) => {
  try {
    const ticket = await Ticket.findById(ticketId); // This model method joins Users
    if (!ticket) {
        console.warn(`notifyNewTicketCreation: Ticket ID ${ticketId} not found.`);
        return;
    }

    // To Client
    if (ticket.client_email) {
      const subjectClient = `Ticket #${ticket.id} Created: ${ticket.subject}`;
      const textClient = `Hello ${ticket.client_name},

Your support ticket titled "${ticket.subject}" has been successfully created.
Ticket ID: #${ticket.id}
Priority: ${ticket.priority}
Status: ${ticket.status}

You can view your ticket here: ${SITE_URL}/tickets/${ticket.id}

Thank you,
Support Team`;
      const htmlClient = `<p>Hello ${ticket.client_name},</p><p>Your support ticket titled "<strong>${ticket.subject}</strong>" has been successfully created.</p><ul><li>Ticket ID: #${ticket.id}</li><li>Priority: ${ticket.priority}</li><li>Status: ${ticket.status}</li></ul><p>You can view your ticket <a href="${SITE_URL}/tickets/${ticket.id}">here</a>.</p><p>Thank you,<br/>Support Team</p>`;
      await sendEmail(ticket.client_email, subjectClient, textClient, htmlClient);
    } else {
        console.warn(`notifyNewTicketCreation: client_email not found for ticket ID ${ticketId}.`);
    }

    // To Admin/Support
    const adminEmail = process.env.ADMIN_EMAIL_NOTIFICATIONS;
    if (adminEmail) {
        const subjectAdmin = `New Ticket #${ticket.id} Created by ${ticket.client_name || 'N/A'}: ${ticket.subject}`;
        const textAdmin = `A new support ticket has been created by ${ticket.client_name || 'N/A'} (Email: ${ticket.client_email || 'N/A'}).
ID: #${ticket.id}
Subject: ${ticket.subject}
Priority: ${ticket.priority}

View it here: ${SITE_URL}/admin/tickets/${ticket.id}`;
        await sendEmail(adminEmail, subjectAdmin, textAdmin);
    }

  } catch (error) {
    console.error(`Error in notifyNewTicketCreation for ticket ${ticketId}:`, error);
  }
};

const notifyTicketAssignment = async (ticketId) => {
    try {
        const ticket = await Ticket.findById(ticketId); // Ensure this fetches assigned_agent_email & name
        if (!ticket) {
            console.warn(`notifyTicketAssignment: Ticket ID ${ticketId} not found.`);
            return;
        }
        if (!ticket.assigned_to_user_id || !ticket.assigned_agent_email) {
            console.warn(`notifyTicketAssignment: Ticket ID ${ticketId} is not assigned or agent email is missing.`);
            return;
        }

        const subject = `You have been assigned to Ticket #${ticket.id}: ${ticket.subject}`;
        const text = `Hello ${ticket.assigned_agent_name || 'Support Agent'},

You have been assigned to a new support ticket.
ID: #${ticket.id}
Subject: ${ticket.subject}
Priority: ${ticket.priority}
Client: ${ticket.client_name || 'N/A'}

You can view the ticket here: ${SITE_URL}/support/tickets/${ticket.id}`;
        const html = `<p>Hello ${ticket.assigned_agent_name || 'Support Agent'},</p><p>You have been assigned to a new support ticket.</p><ul><li>ID: #${ticket.id}</li><li>Subject: ${ticket.subject}</li><li>Priority: ${ticket.priority}</li><li>Client: ${ticket.client_name || 'N/A'}</li></ul><p>You can view the ticket <a href="${SITE_URL}/support/tickets/${ticket.id}">here</a>.</p>`;
        await sendEmail(ticket.assigned_agent_email, subject, text, html);
    } catch (error) {
        console.error(`Error in notifyTicketAssignment for ticket ${ticketId}:`, error);
    }
};

const notifyNewComment = async (commentId, ticketId /*, commenterUserId - needed for more advanced logic */) => {
    try {
        const ticket = await Ticket.findById(ticketId);
        if(!ticket) {
            console.warn(`notifyNewComment: Ticket ID ${ticketId} not found.`);
            return;
        }

        // This is a simplified version. TODO: Enhance this to:
        // 1. Fetch comment details (e.g., using a TicketComment.findById(commentId)).
        // 2. Fetch commenter details (e.g., using User.findById(commenterUserId)).
        // 3. Avoid notifying the user who made the comment.
        // 4. Only notify client if comment is not internal and made by support/admin.
        // 5. Only notify support if comment is made by client.

        // Notify client (if comment was not by them and not internal - assuming this check happens before calling)
        if (ticket.client_email /* && commenter.role !== 'CLIENT' && !comment.is_internal_note */) {
            const subject = `Update on Ticket #${ticket.id}: ${ticket.subject}`;
            const text = `Hello ${ticket.client_name || 'Client'},

There's a new reply on your support ticket "${ticket.subject}".

View it here: ${SITE_URL}/tickets/${ticket.id}`;
            await sendEmail(ticket.client_email, subject, text);
        }

        // Notify assigned agent (if comment was not by them - assuming this check happens before calling)
        if (ticket.assigned_agent_email /* && commenter.role === 'CLIENT' */) {
            const subject = `New Client Reply on Ticket #${ticket.id}: ${ticket.subject}`;
            const text = `Hello ${ticket.assigned_agent_name || 'Support Agent'},

A client has replied to ticket "${ticket.subject}".

View it here: ${SITE_URL}/support/tickets/${ticket.id}`;
            await sendEmail(ticket.assigned_agent_email, subject, text);
        }
    } catch (error) {
        console.error(`Error in notifyNewComment for ticket ${ticketId}, comment ${commentId}:`, error);
    }
};

const notifyTicketStatusChange = async (ticketId, oldStatus) => {
    try {
        const ticket = await Ticket.findById(ticketId);
        if(!ticket) {
            console.warn(`notifyTicketStatusChange: Ticket ID ${ticketId} not found.`);
            return;
        }
        if (!ticket.client_email) {
            console.warn(`notifyTicketStatusChange: client_email not found for ticket ID ${ticketId}.`);
            return;
        }

        if (ticket.status !== oldStatus) {
             const subject = `Ticket #${ticket.id} Status Update: ${ticket.subject}`;
             const text = `Hello ${ticket.client_name || 'Client'},

The status of your ticket "${ticket.subject}" has been updated from ${oldStatus} to ${ticket.status}.

View it here: ${SITE_URL}/tickets/${ticket.id}`;
             await sendEmail(ticket.client_email, subject, text);
        }
    } catch (error) {
        console.error(`Error in notifyTicketStatusChange for ticket ${ticketId}:`, error);
    }
};

module.exports = {
  notifyNewTicketCreation,
  notifyTicketAssignment,
  notifyNewComment,
  notifyTicketStatusChange
};
