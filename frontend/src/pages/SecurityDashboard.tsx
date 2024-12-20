import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, AlertTriangle, Activity, Lock } from 'lucide-react';
import { mockSecurityService } from '../services/mockSecurityService';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SecurityLogTable } from '../components/security/SecurityLogTable';

export const SecurityDashboard: React.FC = () => {
  const { data: threatMetrics } = useQuery({
    queryKey: ['threatMetrics'],
    queryFn: mockSecurityService.getThreatMetrics
  });

  const { data: ipsMetrics } = useQuery({
    queryKey: ['ipsMetrics'],
    queryFn: mockSecurityService.getIPSMetrics
  });

  const { data: vpnMetrics } = useQuery({
    queryKey: ['vpnMetrics'],
    queryFn: mockSecurityService.getVPNMetrics
  });

  const { data: logs } = useQuery({
    queryKey: ['logs'],
    queryFn: async () => mockSecurityService.getLogs(1, 5)
  });

  if (!threatMetrics || !ipsMetrics || !vpnMetrics || !logs) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Critical Threats</h3>
              <p className="text-2xl font-semibold">
                {threatMetrics.threats_by_severity.critical.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">IDS Detections</h3>
              <p className="text-2xl font-semibold">
                {(ipsMetrics.totalDetections ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">VPN Sessions</h3>
              <p className="text-2xl font-semibold">
                {vpnMetrics.active_sessions.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Network Load</h3>
              <p className="text-2xl font-semibold">
                {(vpnMetrics.bandwidth_usage.incoming_mbps + vpnMetrics.bandwidth_usage.outgoing_mbps).toFixed(1)} Mbps
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Trend and IDS Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Threat Trend (24h)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={threatMetrics.trend_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => [value.toLocaleString(), 'Threats']}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#ef4444" 
                  fill="#fee2e2" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Top Attack Categories</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={ipsMetrics.attacks_by_category}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  width={150}
                />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Security Logs */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Security Events</h2>
        </div>
        <SecurityLogTable 
          logs={logs.logs} 
        />
      </div>
    </div>
  );
}; 