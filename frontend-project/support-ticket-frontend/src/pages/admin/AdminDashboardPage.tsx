// src/pages/admin/AdminDashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTickets } from '../../services/ticketService';
import { Ticket } from '../../types/ticketTypes';
// import { getAllUsers } from '../../services/userService'; // For stats like user counts
// import { User } from '../../types/userTypes';

const AdminDashboardPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  // const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ticketData = await getAllTickets(); // Fetches all tickets
        setTickets(ticketData);
        // const userData = await getAllUsers(); // Example: fetch all users for stats
        // setUsers(userData);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch admin data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading admin dashboard...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  // Basic stats examples
  const openTickets = tickets.filter(t => t.status === 'Open').length;
  const inProcessTickets = tickets.filter(t => t.status === 'In Process').length;
  // const totalClients = users.filter(u => u.role === 'CLIENT').length;
  // const totalSupportAgents = users.filter(u => u.role === 'SUPPORT').length;

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      {/* Stats Cards - Example */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">Total Tickets</h2>
          <p className="text-3xl font-bold text-blue-600">{tickets.length}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">Open Tickets</h2>
          <p className="text-3xl font-bold text-yellow-600">{openTickets}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">In Process</h2>
          <p className="text-3xl font-bold text-indigo-600">{inProcessTickets}</p>
        </div>
        {/* <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">Support Agents</h2>
          <p className="text-3xl font-bold text-green-600">{totalSupportAgents}</p>
        </div> */}
      </div>

      <div className="space-x-4">
        <Link to="/admin/tickets" className="btn-primary">Manage Tickets</Link>
        <Link to="/admin/users" className="btn-secondary">Manage Users (Placeholder)</Link>
        {/* Add more admin links as features are built */}
      </div>
    </div>
  );
};
export default AdminDashboardPage;
