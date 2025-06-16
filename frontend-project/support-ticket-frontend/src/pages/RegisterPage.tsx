// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { toastSuccess, handleApiErrorToast } from '../../utils/toastHelper'; // Import

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Optional
  // const [error, setError] = useState<string | null>(null); // Replaced by toast
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError(null);
    setLoading(true);
    try {
      await registerUser({ name, email, password, phoneNumber });
      toastSuccess('Registration successful! Redirecting...');
      navigate('/dashboard');
    } catch (err: any) {
      // setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed.');
      handleApiErrorToast(err, 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
      {/* {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>} */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required disabled={loading} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required disabled={loading} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required minLength={6} disabled={loading} />
        </div>
         <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">Phone Number (Optional)</label>
          <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="input-field" disabled={loading} />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          <Link to="/login" className="link-style">Already have an account? Login</Link>
        </div>
      </form>
    </div>
  );
};
export default RegisterPage;
