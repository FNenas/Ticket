// src/types/ticketTypes.ts
export interface UserReference {
  id: number; // Changed from string to number to match backend id type for users
  name: string;
  email: string;
}

export interface Ticket {
  id: number; // Changed from string to number
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Process' | 'Closed' | 'Resolved';
  client_user_id: number; // Changed from string to number
  client_name?: string; // From JOIN in backend
  client_email?: string; // From JOIN in backend
  assigned_to_user_id?: number | null; // Changed from string to number
  assigned_agent_name?: string | null; // From JOIN
  assigned_agent_email?: string | null; // From JOIN
  created_at: string; // Date string
  updated_at: string; // Date string
  // whatsapp_message_id?: string | null; // If needed on frontend
}

export interface TicketComment {
  id: number; // Changed from string to number
  ticket_id: number; // Changed from string to number
  user_id: number; // Changed from string to number
  user_name: string; // Name of the user who commented
  user_role: 'CLIENT' | 'SUPPORT' | 'ADMIN';
  comment: string;
  is_internal_note: boolean;
  created_at: string; // Date string
}

export interface CreateTicketPayload {
  subject: string;
  description: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export interface AddCommentPayload {
  comment: string;
  // isInternalNote is handled by backend based on user role
}
