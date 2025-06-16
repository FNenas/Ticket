// src/layouts/MainLayout.tsx
import React, { ReactNode } from 'react';
import Navbar from '../components/common/Navbar';
import { ToastContainer } from 'react-toastify'; // Import
import 'react-toastify/dist/ReactToastify.css'; // Import CSS

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        © {new Date().getFullYear()} Support Ticket System. All rights reserved.
      </footer>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Or "light", "dark"
      />
    </div>
  );
};

export default MainLayout;
