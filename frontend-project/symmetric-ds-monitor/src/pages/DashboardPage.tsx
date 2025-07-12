import React from 'react';
import DashboardMetrics from '../components/DashboardMetrics';
import NodeStatusPanel from '../components/NodeStatusPanel';
import SyncPerformanceChart from '../components/SyncPerformanceChart';
import AlertsPanel from '../components/AlertsPanel';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <DashboardMetrics />
      <NodeStatusPanel />
      <SyncPerformanceChart />
      <AlertsPanel />
    </div>
  );
};

export default DashboardPage;
