// src/pages/ResetPasswordPage.tsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // To get token from URL query param
import { resetPassword } from '../services/authService';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    if (!token) { setError('Invalid or missing reset token.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    try {
      await resetPassword(token, newPassword);
      setMessage('Password has been reset successfully. You can now login.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  if (!token) {
    return <div className="text-center text-red-500 mt-10">Invalid or missing password reset token.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold text-center mb-4">Set New Password</h1>
      <form onSubmit={handleSubmit}>
        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" className="input-field mb-4" required />
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="input-field mb-4" required />
        <button type="submit" className="btn-primary w-full">Reset Password</button>
      </form>
      {message && <p className="text-green-500 mt-4 text-center">{message}</p>}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};
export default ResetPasswordPage;
