import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Users,
  Network,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  Activity
} from 'lucide-react';
import { mockSecurityService } from '../../services/mockSecurityService';

export const VPN: React.FC = () => {
  const { data: vpnMetrics, isLoading } = useQuery({
    queryKey: ['vpnMetrics'],
    queryFn: mockSecurityService.getVPNMetrics,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900" />
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">VPN Status</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
          <Activity className="w-5 h-5" />
          <span className="font-medium">Service Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Active Sessions</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {vpnMetrics?.active_sessions} / {vpnMetrics?.total_users}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownToLine className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Incoming Traffic</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {vpnMetrics?.bandwidth_usage.incoming_mbps.toFixed(1)} Mbps
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpFromLine className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Outgoing Traffic</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {vpnMetrics?.bandwidth_usage.outgoing_mbps.toFixed(1)} Mbps
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-900">Total Protocols</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">
            {vpnMetrics?.protocols.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Protocol Distribution</h3>
          <div className="space-y-4">
            {vpnMetrics?.protocols.map(({ name, sessions }) => (
              <div key={name} className="flex items-center">
                <div className="w-32 font-medium">{name}</div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(sessions / vpnMetrics.active_sessions) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right text-sm text-gray-600">
                  {sessions} users
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data Transfer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vpnMetrics?.session_data.map((session) => (
                  <tr key={session.user} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{session.user}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{session.ip_address}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {formatDuration(session.duration)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {formatBytes(session.bytes_transferred)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Connection Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Session Success Rate</div>
            <div className="text-2xl font-bold text-gray-900">98.5%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Average Session Duration</div>
            <div className="text-2xl font-bold text-gray-900">2h 45m</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Peak Concurrent Users</div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.max(...vpnMetrics?.protocols.map(p => p.sessions) || [0])}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 