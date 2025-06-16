// src/pages/client/ClientDashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyTickets } from '../../services/ticketService';
import { Ticket } from '../../types/ticketTypes';
import { useAuthStore } from '../../store/authStore'; // To ensure client role

const ClientDashboardPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user?.role !== 'CLIENT') {
      setError("Access denied. This page is for clients only.");
      setLoading(false);
      return;
    }

    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await getMyTickets();
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

  if (loading) return <p className="text-center mt-8">Loading your tickets...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">My Support Tickets</h1>
        <Link
          to="/tickets/new"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create New Ticket
        </Link>
      </div>
      {tickets.length === 0 ? (
        <p>You have not created any tickets yet.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Updated</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">#{ticket.id}</td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{ticket.subject}</td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                                      ticket.status === 'In Process' ? 'bg-blue-100 text-blue-800' :
                                      ticket.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                                      'bg-green-100 text-green-800'}`}> {/* Resolved */}
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{ticket.priority}</td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{new Date(ticket.updated_at).toLocaleString()}</td>
                  <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    <Link to={`/tickets/${ticket.id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
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
export default ClientDashboardPage;
