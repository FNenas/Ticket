import React from 'react';

const NodeStatusPanel: React.FC = () => {
  const nodes = [
    { id: '001', type: 'corp', status: 'online', lastSync: '2024-07-30 10:00:00', successRate: '99.8%' },
    { id: '002', type: 'store', status: 'offline', lastSync: '2024-07-29 18:30:00', successRate: '95.2%' },
    { id: '003', type: 'store', status: 'syncing', lastSync: '2024-07-30 10:05:00', successRate: '100%' },
    { id: '004', type: 'corp', status: 'online', lastSync: '2024-07-30 09:55:00', successRate: '99.9%' },
  ];

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'syncing':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Node Status</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Node ID</th>
              <th className="py-2 px-4 border-b">Node Type</th>
              <th className="py-2 px-4 border-b">Last Sync</th>
              <th className="py-2 px-4 border-b">Success Rate</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map(node => (
              <tr key={node.id}>
                <td className="py-2 px-4 border-b text-center">
                  <span className={`h-4 w-4 rounded-full inline-block ${getStatusIndicator(node.status)}`}></span>
                </td>
                <td className="py-2 px-4 border-b">{node.id}</td>
                <td className="py-2 px-4 border-b">{node.type}</td>
                <td className="py-2 px-4 border-b">{node.lastSync}</td>
                <td className="py-2 px-4 border-b">{node.successRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NodeStatusPanel;
