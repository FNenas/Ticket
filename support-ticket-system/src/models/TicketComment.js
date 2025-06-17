// src/models/TicketComment.js
const db = require('../config/db');

const TicketComment = {
  async create(ticketId, userId, comment, isInternalNote = false) {
    const insertSql = `
      INSERT INTO TicketComments (ticket_id, user_id, comment, is_internal_note)
      VALUES (?, ?, ?, ?);
    `;
    const values = [ticketId, userId, comment, isInternalNote];

    try {
      const result = await db.query(insertSql, values);
      const insertId = result.rows.insertId;

      if (!insertId) {
        throw new Error('Ticket comment creation failed, no insertId returned or insertId is invalid.');
      }

      // After creating a comment, update the parent ticket's updated_at timestamp
      const updateTicketSql = 'UPDATE Tickets SET updated_at = CURRENT_TIMESTAMP(6) WHERE id = ?;';
      await db.query(updateTicketSql, [ticketId]);

      // Fetch the newly created comment by its ID, joined with user details
      const selectSql = `
        SELECT tc.*, u.name as user_name, u.role as user_role
        FROM TicketComments tc
        JOIN Users u ON tc.user_id = u.id
        WHERE tc.id = ?;
      `;
      const { rows: commentRows } = await db.query(selectSql, [insertId]);
      if (!commentRows || commentRows.length === 0) {
        // This case should ideally not happen if insertId was valid
        throw new Error('Failed to fetch the created comment.');
      }
      return commentRows[0];

    } catch (error) {
      console.error('Error creating ticket comment:', error);
      throw error;
    }
  },

  async findByTicketId(ticketId, userRole) {
    let sql = `
      SELECT tc.*, u.name as user_name, u.role as user_role
      FROM TicketComments tc
      JOIN Users u ON tc.user_id = u.id
      WHERE tc.ticket_id = ?
    `;
    const params = [ticketId];

    if (userRole === 'CLIENT') {
      sql += ' AND tc.is_internal_note = FALSE';
      // For MySQL, FALSE is 0. If is_internal_note is TINYINT(1), this is fine.
      // Alternatively, can use: sql += ' AND tc.is_internal_note = ?'; params.push(0);
    }
    sql += ' ORDER BY tc.created_at ASC;';

    try {
      const { rows } = await db.query(sql, params);
      return rows;
    } catch (error) {
      console.error('Error finding comments by ticket id:', error);
      throw error;
    }
  }
};

module.exports = TicketComment;
