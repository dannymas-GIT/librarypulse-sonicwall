import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockSecurityService } from '../../services/mockSecurityService';
import { VPNMetrics } from '../../types/security';

export const VPN: React.FC = () => {
  const { data: vpnMetrics, isLoading } = useQuery<VPNMetrics>({
    queryKey: ['vpnMetrics'],
    queryFn: mockSecurityService.getVPNMetrics
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!vpnMetrics) {
    return <div>No metrics available</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">VPN Status</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Active Sessions</h2>
          <p className="text-3xl font-bold text-blue-600">
            {vpnMetrics.active_sessions} / {vpnMetrics.total_users}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Incoming Bandwidth</h2>
          <p className="text-3xl font-bold text-green-600">
            {vpnMetrics.bandwidth_usage.incoming_mbps.toFixed(1)} Mbps
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Outgoing Bandwidth</h2>
          <p className="text-3xl font-bold text-orange-600">
            {vpnMetrics.bandwidth_usage.outgoing_mbps.toFixed(1)} Mbps
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Protocol Distribution</h2>
          <p className="text-sm text-gray-600 mb-4">
            Total Protocols: {vpnMetrics.protocols.length}
          </p>
          <div className="space-y-4">
            {vpnMetrics.protocols.map(({ name, sessions }) => (
              <div key={name} className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{name}</span>
                  <span className="text-sm text-gray-600">
                    {sessions} sessions
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(sessions / vpnMetrics.active_sessions) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Transfer
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vpnMetrics.session_data.map((session) => (
                  <tr key={session.user}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {session.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {session.ip_address}
                    </td>
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
      </div>

      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Session Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Peak Sessions</p>
            <p className="text-xl font-semibold">
              {Math.max(...vpnMetrics.protocols.map(p => p.sessions) || [0])}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Data Transfer</p>
            <p className="text-xl font-semibold">
              {(vpnMetrics.session_data.reduce((sum, session) => sum + session.bytes_transferred, 0) / (1024 * 1024 * 1024)).toFixed(2)} GB
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Average Session Duration</p>
            <p className="text-xl font-semibold">
              {Math.floor(vpnMetrics.session_data.reduce((sum, session) => sum + session.duration, 0) / vpnMetrics.session_data.length / 60)} minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 