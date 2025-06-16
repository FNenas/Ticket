// src/pages/RequestPasswordResetPage.tsx
import React, { useState } from 'react';
import { requestPasswordReset } from '../services/authService';

const RequestPasswordResetPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      await requestPasswordReset(email);
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request password reset.');
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold text-center mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="input-field mb-4" required />
        <button type="submit" className="btn-primary w-full">Send Reset Link</button>
      </form>
      {message && <p className="text-green-500 mt-4 text-center">{message}</p>}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};
export default RequestPasswordResetPage;
