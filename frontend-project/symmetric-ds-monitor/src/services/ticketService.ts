// src/services/ticketService.ts
import apiClient from './api';
import { Ticket, TicketComment, CreateTicketPayload } from '../types/ticketTypes'; // Removed AddCommentPayload as it's replaced by AddCommentServicePayload

// --- Existing functions from previous step ---
// For Client: Get their own tickets
export const getMyTickets = async (): Promise<Ticket[]> => {
  const response = await apiClient.get<Ticket[]>('/tickets');
  return response.data;
};

// Get a single ticket by ID (reused by support)
export const getTicketById = async (ticketId: number | string): Promise<Ticket> => {
  const response = await apiClient.get<Ticket>(`/tickets/${ticketId}`);
  return response.data;
};

// Create a new ticket (Client specific)
export const createTicket = async (payload: CreateTicketPayload): Promise<Ticket> => {
  const response = await apiClient.post<Ticket>('/tickets', payload);
  return response.data;
};

// Get comments for a ticket (reused, backend handles filtering for client vs support)
export const getTicketComments = async (ticketId: number | string): Promise<TicketComment[]> => {
  const response = await apiClient.get<TicketComment[]>(`/tickets/${ticketId}/comments`);
  return response.data;
};

// Updated Add Comment function
export interface AddCommentServicePayload { // More generic name for service layer
    comment: string;
    isInternalNote?: boolean; // Optional for client, settable by support/admin
}
export const addTicketComment = async (ticketId: number | string, payload: AddCommentServicePayload): Promise<TicketComment> => {
    const response = await apiClient.post<TicketComment>(`/tickets/${ticketId}/comments`, payload);
    return response.data;
};
// --- End of functions from previous step / modified functions ---

// For Support/Admin: Get all tickets (or filterable list)
// Assuming backend GET /tickets for SUPPORT/ADMIN returns all relevant tickets
export const getAllTickets = async (/* TODO: Add filter params like status, priority */): Promise<Ticket[]> => {
  const response = await apiClient.get<Ticket[]>('/tickets'); // May need query params for filtering
  return response.data;
};

// For Support/Admin: Update ticket status
export const updateTicketStatus = async (ticketId: number | string, status: Ticket['status']): Promise<Ticket> => {
  const response = await apiClient.put<Ticket>(`/tickets/${ticketId}/status`, { status });
  return response.data;
};

// For Support/Admin: Assign ticket to an agent
export const assignTicketToAgent = async (ticketId: number | string, agentId: number): Promise<Ticket> => {
  const response = await apiClient.put<Ticket>(`/tickets/${ticketId}/assign`, { agentId });
  return response.data;
};
