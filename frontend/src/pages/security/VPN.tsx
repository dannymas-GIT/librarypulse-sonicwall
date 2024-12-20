import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockSecurityService } from '../../services/mockSecurityService';

export const VPN: React.FC = () => {
  const { data: vpnMetrics, isLoading } = useQuery({
    queryKey: ['vpnMetrics'],
    queryFn: mockSecurityService.getVPNMetrics
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">VPN Status</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Active Sessions</h3>
          <p className="text-2xl font-semibold mt-2">
            {vpnMetrics?.active_sessions || '-'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-2xl font-semibold mt-2">
            {vpnMetrics?.total_users || '-'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Incoming Bandwidth</h3>
          <p className="text-2xl font-semibold mt-2">
            {vpnMetrics?.bandwidth_usage.incoming_mbps.toFixed(1) || '-'} Mbps
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Outgoing Bandwidth</h3>
          <p className="text-2xl font-semibold mt-2">
            {vpnMetrics?.bandwidth_usage.outgoing_mbps.toFixed(1) || '-'} Mbps
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Transfer</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vpnMetrics?.session_data.map((session) => (
                  <tr key={session.user}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.ip_address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.floor(session.duration / 60)} minutes
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(session.bytes_transferred / (1024 * 1024)).toFixed(2)} MB
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Protocol Distribution</h2>
          <div className="space-y-4">
            {vpnMetrics?.protocols.map(({ name, sessions }) => (
              <div key={name} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{name}</span>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(sessions / vpnMetrics.active_sessions) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{sessions} sessions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 