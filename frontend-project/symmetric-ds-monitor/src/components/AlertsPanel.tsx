import React from 'react';

const AlertsPanel: React.FC = () => {
  const alerts = [
    { type: 'error', message: 'Node 002 is offline', timestamp: '2024-07-30 10:10:00' },
    { type: 'warning', message: 'High latency detected on Node 003', timestamp: '2024-07-30 10:08:00' },
    { type: 'info', message: 'Node 001 completed a full sync', timestamp: '2024-07-30 10:05:00' },
  ];

  const getAlertClasses = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 'info':
        return 'bg-blue-100 border-blue-400 text-blue-700';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Alerts</h3>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className={`border-l-4 p-4 ${getAlertClasses(alert.type)}`} role="alert">
            <p className="font-bold">{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</p>
            <p>{alert.message}</p>
            <p className="text-sm text-gray-600">{alert.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;
