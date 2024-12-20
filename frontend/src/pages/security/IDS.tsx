import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, AlertTriangle, Activity } from 'lucide-react';
import { mockSecurityService } from '../../services/mockSecurityService';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const IDS: React.FC = () => {
  const { data: ipsMetrics } = useQuery({
    queryKey: ['ipsMetrics'],
    queryFn: mockSecurityService.getIPSMetrics
  });

  if (!ipsMetrics) {
    return <div>Loading...</div>;
  }

  const detectionData = (ipsMetrics.detectionsByType ?? []).map(item => ({
    name: item.type,
    value: item.count
  }));

  const attackData = (ipsMetrics.attacks_by_category ?? []).map(item => ({
    name: item.category,
    count: item.count,
    severity: item.severity
  }));

  const topAttackers = (ipsMetrics.topAttackers ?? []).map(item => ({
    name: item.ip,
    attacks: item.count
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Intrusion Detection System</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Detections</h3>
              <p className="text-2xl font-semibold">
                {(ipsMetrics.totalDetections ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Blocked Attacks</h3>
              <p className="text-2xl font-semibold">
                {(ipsMetrics.blockedAttacks ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Active Signatures</h3>
              <p className="text-2xl font-semibold">
                {(ipsMetrics.signature_coverage?.active_signatures ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Detection Types Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={detectionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => 
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {detectionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Top Attack Categories</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={attackData}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
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

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Top Attackers</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={topAttackers}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={150}
              />
              <Tooltip />
              <Bar 
                dataKey="attacks" 
                fill="#82ca9d"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 