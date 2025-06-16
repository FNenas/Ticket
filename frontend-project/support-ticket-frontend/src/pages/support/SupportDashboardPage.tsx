// src/pages/support/SupportDashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTickets } from '../../services/ticketService'; // Using getAllTickets
import { Ticket } from '../../types/ticketTypes';
import { useAuthStore } from '../../store/authStore';

const SupportDashboardPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Could add role check here if needed, but ProtectedRoute should handle it
    const fetchTickets = async () => {
      try {
        setLoading(true);
        // TODO: Implement filtering (e.g., assigned to me, unassigned, specific statuses)
        // For now, fetches all tickets the backend provides to a support role
        const data = await getAllTickets();
        setTickets(data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch tickets.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [user]);

  if (loading) return <p className="text-center mt-8">Loading tickets...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  // TODO: Add filtering UI controls (dropdowns, search box)

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Support Dashboard</h1>
      {/* Placeholder for filter controls */}
      {tickets.length === 0 ? (
        <p>No tickets found matching current filters (or no tickets available).</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                  <td className="td-cell">
                    <Link to={`/support/tickets/${ticket.id}`} className="text-indigo-600 hover:text-indigo-900">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
// Add utility classes for th-cell, td-cell, status-badge in src/index.css
/*
// src/index.css (add these or similar)
.th-cell { @apply px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider; }
.td-cell { @apply px-5 py-4 border-b border-gray-200 bg-white text-sm; }
.status-badge { @apply px-2 inline-flex text-xs leading-5 font-semibold rounded-full; }
.status-open { @apply bg-yellow-100 text-yellow-800; }
.status-in-process { @apply bg-blue-100 text-blue-800; }
.status-closed { @apply bg-gray-100 text-gray-800; }
.status-resolved { @apply bg-green-100 text-green-800; }
*/
export default SupportDashboardPage;
