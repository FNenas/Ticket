// src/pages/client/CreateTicketPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../../services/ticketService';
import { CreateTicketPayload, Ticket } from '../../types/ticketTypes';
import { toastSuccess, handleApiErrorToast } from '../../utils/toastHelper'; // Import

const CreateTicketPage: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  // const [error, setError] = useState<string | null>(null); // Can be replaced by toast
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError(null);
    setSubmitting(true);
    const payload: CreateTicketPayload = { subject, description, priority };
    try {
      const newTicket: Ticket = await createTicket(payload);
      toastSuccess(`Ticket #${newTicket.id} created successfully!`);
      navigate(`/tickets/${newTicket.id}`);
    } catch (err: any) {
      // setError(err.response?.data?.message || 'Failed to create ticket.');
      handleApiErrorToast(err, 'Failed to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create New Support Ticket</h1>
      {/* {error && <p className="text-red-500 text-sm mb-4">{error}</p>} */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
          <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="input-field" required disabled={submitting}/>
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="input-field" required disabled={submitting}/>
        </div>
        <div className="mb-6">
          <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)} className="input-field" disabled={submitting}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div className="flex items-center">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateTicketPage;
