import React from 'react';

const DashboardMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Online Nodes</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">10</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Active Syncs</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">5</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Pending Changes</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">120</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Sync Errors</h3>
        <p className="mt-2 text-3xl font-bold text-red-600">3</p>
      </div>
    </div>
  );
};

export default DashboardMetrics;
