// src/pages/admin/AdminTicketListPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllTickets, assignTicketToAgent } from '../../services/ticketService';
import { getAllUsers } from '../../services/userService';
import { Ticket } from '../../types/ticketTypes';
import { User } from '../../types/userTypes';
import { toastSuccess, handleApiErrorToast, toastError } from '../../utils/toastHelper'; // Import

const AdminTicketListPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [supportAgents, setSupportAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null); // For page load error
  const [selectedTicketToAssign, setSelectedTicketToAssign] = useState<Ticket | null>(null);
  const [assigningAgentId, setAssigningAgentId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);


  const fetchAllData = useCallback(async (showLoadingSpinner = true) => {
    if(showLoadingSpinner) setLoading(true);
    try {
      const ticketData = await getAllTickets();
      setTickets(ticketData);
      const agentData = await getAllUsers('SUPPORT');
      setSupportAgents(agentData);
      setPageError(null);
    } catch (err: any) {
      handleApiErrorToast(err, 'Failed to fetch data.');
    } finally {
      if(showLoadingSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleOpenAssignModal = (ticket: Ticket) => {
    setSelectedTicketToAssign(ticket);
    setAssigningAgentId(ticket.assigned_to_user_id?.toString() || '');
  };

  const handleAssignTicket = async () => {
    if (!selectedTicketToAssign || !assigningAgentId) {
      toastError("Please select an agent."); return;
    }
    const agentIdNum = parseInt(assigningAgentId, 10);
    if (isNaN(agentIdNum)) {
      toastError("Invalid agent ID selected."); return;
    }
    setIsAssigning(true);
    try {
      await assignTicketToAgent(selectedTicketToAssign.id, agentIdNum);
      toastSuccess(`Ticket #${selectedTicketToAssign.id} assigned successfully.`);
      setSelectedTicketToAssign(null);
      setAssigningAgentId('');
      fetchAllData(false); // Refresh ticket list without main page spinner
    } catch (err: any) {
      handleApiErrorToast(err, 'Failed to assign ticket.');
    } finally {
      setIsAssigning(false);
    }
  };


  if (loading) return <p className="text-center mt-8">Loading tickets...</p>;
  if (pageError) return <p className="text-center text-red-500 mt-8">{pageError}</p>;

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Manage All Tickets</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="th-cell">ID</th>
              <th className="th-cell">Subject</th>
              <th className="th-cell">Status</th>
              <th className="th-cell">Priority</th>
              <th className="th-cell">Client</th>
              <th className="th-cell">Assigned Agent</th>
              <th className="th-cell">Last Updated</th>
              <th className="th-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="td-cell">#{ticket.id}</td>
                <td className="td-cell">{ticket.subject}</td>
                <td className="td-cell">
                  <span className={`status-badge status-${ticket.status.toLowerCase().replace(' ', '-')}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="td-cell">{ticket.priority}</td>
                <td className="td-cell">{ticket.client_name || 'N/A'}</td>
                <td className="td-cell">{ticket.assigned_agent_name || <span className="text-gray-500 italic">Unassigned</span>}</td>
                <td className="td-cell">{new Date(ticket.updated_at).toLocaleString()}</td>
                <td className="td-cell space-x-2">
                  <Link to={`/support/tickets/${ticket.id}`} className="link-style text-sm">View</Link>
                  <button onClick={() => handleOpenAssignModal(ticket)} className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTicketToAssign && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl space-y-4 w-full max-w-md">
            <h3 className="text-xl font-semibold">Assign Ticket #{selectedTicketToAssign.id}</h3>
            <p className="text-sm text-gray-700">Subject: {selectedTicketToAssign.subject}</p>
            <div>
              <label htmlFor="agentSelect" className="block text-sm font-medium text-gray-700 mb-1">Assign to:</label>
              <select
                id="agentSelect"
                value={assigningAgentId}
                onChange={(e) => setAssigningAgentId(e.target.value)}
                className="input-field w-full"
                disabled={isAssigning}
              >
                <option value="">Select an Agent</option>
                {supportAgents.map(agent => (
                  <option key={agent.id} value={agent.id.toString()}>
                    {agent.name} ({agent.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button onClick={() => setSelectedTicketToAssign(null)} className="btn-secondary" disabled={isAssigning}>Cancel</button>
              <button onClick={handleAssignTicket} className="btn-primary" disabled={isAssigning}>
                {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminTicketListPage;
