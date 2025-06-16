// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
// import { useAuthStore } from '../store/authStore'; // No longer directly used here for login action
import { toastSuccess, handleApiErrorToast } from '../../utils/toastHelper'; // Import toast helper

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState<string | null>(null); // Inline error can still be used or replaced by toast
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const login = useAuthStore((state) => state.login); // Store login is called by authService

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError(null); // Clear previous inline error
    setLoading(true);
    try {
      await loginUser({ email, password }); // authService now handles storing token/user
      toastSuccess('Login successful! Redirecting...');
      navigate('/dashboard');
    } catch (err: any) {
      // setError(err.response?.data?.message || err.message || 'Login failed.'); // Keep for inline form error
      handleApiErrorToast(err, 'Login failed. Please try again.'); // Show toast for general error
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
      {/* {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>} Inline error display */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required disabled={loading}/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required disabled={loading}/>
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <Link to="/register" className="link-style">Don't have an account? Register</Link>
        </div>
        <div className="text-center mt-4">
            <Link to="/request-password-reset" className="text-sm text-gray-600 hover:text-gray-800">
                Forgot Password?
            </Link>
        </div>
      </form>
    </div>
  );
};
export default LoginPage;
