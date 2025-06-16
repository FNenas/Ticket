// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import DashboardPage from './pages/DashboardPage'; // General dashboard, might be unused or be a redirector
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import RequestPasswordResetPage from './pages/RequestPasswordResetPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import ClientDashboardPage from './pages/client/ClientDashboardPage';
import CreateTicketPage from './pages/client/CreateTicketPage';
import ClientTicketDetailPage from './pages/client/ClientTicketDetailPage';

import SupportDashboardPage from './pages/support/SupportDashboardPage';
import SupportTicketDetailPage from './pages/support/SupportTicketDetailPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminTicketListPage from './pages/admin/AdminTicketListPage';
import AdminUserListPage from './pages/admin/AdminUserListPage';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/request-password-reset" element={<RequestPasswordResetPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Client Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
            <Route path="/dashboard" element={<ClientDashboardPage />} />
            <Route path="/tickets/new" element={<CreateTicketPage />} />
            <Route path="/tickets/:id" element={<ClientTicketDetailPage />} />
          </Route>

          {/* Support Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['SUPPORT', 'ADMIN']} />}> {/* ADMIN can also access support pages */}
            <Route path="/support/dashboard" element={<SupportDashboardPage />} />
            <Route path="/support/tickets/:id" element={<SupportTicketDetailPage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/tickets" element={<AdminTicketListPage />} />
            <Route path="/admin/users" element={<AdminUserListPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
