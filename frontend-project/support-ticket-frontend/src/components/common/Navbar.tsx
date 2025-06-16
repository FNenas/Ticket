// src/components/common/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logoutUser } from '../../services/authService';

const Navbar: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); // Clears store
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-blue-200">
          SupportSystem
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin/somepage" className="hover:text-blue-200">Admin</Link>
              )}
              <span className="text-blue-100">Welcome, {user?.name}!</span>
              <button onClick={handleLogout} className="hover:text-red-300 font-semibold">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="hover:text-blue-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
