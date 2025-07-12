// src/models/Ticket.js
const db = require('../config/db');

const Ticket = {
  async create(subject, description, priority, clientUserId, status = 'Open') {
    const sql = `
      INSERT INTO Tickets (subject, description, priority, client_user_id, status)
      VALUES (?, ?, ?, ?, ?);
    `;
    const values = [subject, description, priority, clientUserId, status];
    try {
      const result = await db.query(sql, values);
      const insertId = result.rows.insertId;
      if (!insertId) {
        throw new Error('Ticket creation failed, no insertId returned or insertId is invalid.');
      }
      return this.findById(insertId); // Fetch the created ticket
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  async findById(id) {
    const sql = `
        SELECT t.*,
               uc.name as client_name, uc.email as client_email,
               ua.name as assigned_agent_name, ua.email as assigned_agent_email
        FROM Tickets t
        JOIN Users uc ON t.client_user_id = uc.id
        LEFT JOIN Users ua ON t.assigned_to_user_id = ua.id
        WHERE t.id = ?;
    `;
    try {
      const { rows } = await db.query(sql, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error finding ticket by id:', error);
      throw error;
    }
  },

  async findByClientId(clientUserId) {
    const sql = 'SELECT * FROM Tickets WHERE client_user_id = ? ORDER BY updated_at DESC;';
    try {
      const { rows } = await db.query(sql, [clientUserId]);
      return rows;
    } catch (error) {
      console.error('Error finding tickets by client id:', error);
      throw error;
    }
  },

  async findByAssignedAgentId(agentUserId) {
    const sql = 'SELECT * FROM Tickets WHERE assigned_to_user_id = ? ORDER BY updated_at DESC;';
     try {
      const { rows } = await db.query(sql, [agentUserId]);
      return rows;
    } catch (error) {
      console.error('Error finding tickets by agent id:', error);
      throw error;
    }
  },

  async findAll() {
    const sql = 'SELECT * FROM Tickets ORDER BY updated_at DESC;';
    try {
      const { rows } = await db.query(sql);
      return rows;
    } catch (error) {
      console.error('Error finding all tickets:', error);
      throw error;
    }
  },

  async updateStatus(id, status) {
    const sql = 'UPDATE Tickets SET status = ?, updated_at = CURRENT_TIMESTAMP(6) WHERE id = ?;';
    try {
      const result = await db.query(sql, [status, id]);
      if (result.rows.affectedRows === 0) {
        // Optionally, handle case where no row was updated (e.g., ticket not found)
        // For now, findById will return undefined if not found after an attempted update.
        console.warn(`Attempted to update status for ticket ID ${id}, but no rows were affected. Ticket might not exist or status is the same.`);
      }
      return this.findById(id); // Fetch and return the updated ticket (or undefined if not found)
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw error;
    }
  },

  async assignAgent(id, agentUserId) {
    const sql = 'UPDATE Tickets SET assigned_to_user_id = ?, updated_at = CURRENT_TIMESTAMP(6) WHERE id = ?;';
    try {
      const result = await db.query(sql, [agentUserId, id]);
      if (result.rows.affectedRows === 0) {
        console.warn(`Attempted to assign agent for ticket ID ${id}, but no rows were affected. Ticket might not exist.`);
      }
      return this.findById(id); // Fetch and return the updated ticket
    } catch (error) {
      console.error('Error assigning agent to ticket:', error);
      throw error;
    }
  },
};

module.exports = Ticket;
