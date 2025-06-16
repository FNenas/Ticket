// src/models/TicketComment.js
const db = require('../config/db');

const TicketComment = {
  async create(ticketId, userId, comment, isInternalNote = false) {
    const query = `
      INSERT INTO TicketComments (ticket_id, user_id, comment, is_internal_note)
      VALUES ($1, $2, $3, $4)
      RETURNING id, ticket_id, user_id, comment, is_internal_note, created_at;
    `;
    const values = [ticketId, userId, comment, isInternalNote];
    try {
      const { rows } = await db.query(query, values);
      // After creating a comment, update the parent ticket's updated_at timestamp
      await db.query('UPDATE Tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [ticketId]);
      return rows[0];
    } catch (error) {
      console.error('Error creating ticket comment:', error);
      throw error;
    }
  },

  async findByTicketId(ticketId, userRole) {
    let query = `
      SELECT tc.*, u.name as user_name, u.role as user_role
      FROM TicketComments tc
      JOIN Users u ON tc.user_id = u.id
      WHERE tc.ticket_id = $1
    `;
    // If the user is a CLIENT, only show non-internal notes
    if (userRole === 'CLIENT') {
      query += ' AND tc.is_internal_note = FALSE';
    }
    query += ' ORDER BY tc.created_at ASC;';
    try {
      const { rows } = await db.query(query, [ticketId]);
      return rows;
    } catch (error) {
      console.error('Error finding comments by ticket id:', error);
      throw error;
    }
  }
  // Add findById, update, delete if needed later
};

module.exports = TicketComment;
