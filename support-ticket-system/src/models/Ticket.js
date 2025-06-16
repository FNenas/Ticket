// src/models/Ticket.js
const db = require('../config/db');

const Ticket = {
  async create(subject, description, priority, clientUserId, status = 'Open') {
    const query = `
      INSERT INTO Tickets (subject, description, priority, client_user_id, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, subject, description, priority, status, client_user_id, created_at, updated_at;
    `;
    const values = [subject, description, priority, clientUserId, status];
    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  async findById(id) {
    // Consider joining with Users table to get client/assignee names directly if often needed
    const query = `
        SELECT t.*,
               uc.name as client_name, uc.email as client_email,
               ua.name as assigned_agent_name, ua.email as assigned_agent_email
        FROM Tickets t
        JOIN Users uc ON t.client_user_id = uc.id
        LEFT JOIN Users ua ON t.assigned_to_user_id = ua.id
        WHERE t.id = $1;
    `;
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error finding ticket by id:', error);
      throw error;
    }
  },

  async findByClientId(clientUserId) {
    const query = 'SELECT * FROM Tickets WHERE client_user_id = $1 ORDER BY updated_at DESC;';
    try {
      const { rows } = await db.query(query, [clientUserId]);
      return rows;
    } catch (error) {
      console.error('Error finding tickets by client id:', error);
      throw error;
    }
  },

  async findByAssignedAgentId(agentUserId) {
    const query = 'SELECT * FROM Tickets WHERE assigned_to_user_id = $1 ORDER BY updated_at DESC;';
     try {
      const { rows } = await db.query(query, [agentUserId]);
      return rows;
    } catch (error)
    {
      console.error('Error finding tickets by agent id:', error);
      throw error;
    }
  },

  async findAll() { // For Admin
    const query = 'SELECT * FROM Tickets ORDER BY updated_at DESC;';
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error finding all tickets:', error);
      throw error;
    }
  },

  async updateStatus(id, status) {
    const query = 'UPDATE Tickets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;';
    try {
      const { rows } = await db.query(query, [status, id]);
      return rows[0];
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw error;
    }
  },

  async assignAgent(id, agentUserId) {
    const query = 'UPDATE Tickets SET assigned_to_user_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;';
    try {
      const { rows } = await db.query(query, [agentUserId, id]);
      return rows[0];
    } catch (error) {
      console.error('Error assigning agent to ticket:', error);
      throw error;
    }
  },

  // More methods can be added: updatePriority, search, etc.
};

module.exports = Ticket;
