import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockSecurityService } from '../../services/mockSecurityService';
import { Shield, AlertTriangle, Activity } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const ThreatPrevention: React.FC = () => {
  const { data: threatMetrics, isLoading } = useQuery({
    queryKey: ['threatMetrics'],
    queryFn: mockSecurityService.getThreatMetrics
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const threatTypeData = threatMetrics ? Object.entries(threatMetrics.threats_by_type).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  })) : [];

  const severityData = threatMetrics ? Object.entries(threatMetrics.threats_by_severity).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  })) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Threat Prevention</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Threats Blocked</h3>
              <p className="text-2xl font-semibold">
                {threatMetrics?.total_threats_blocked.toLocaleString() || '-'}
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
              <h3 className="text-sm font-medium text-gray-500">Critical Threats</h3>
              <p className="text-2xl font-semibold text-red-600">
                {threatMetrics?.threats_by_severity.critical.toLocaleString() || '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Active Alerts</h3>
              <p className="text-2xl font-semibold text-yellow-600">
                {threatMetrics?.trend_data[threatMetrics.trend_data.length - 1]?.count.toLocaleString() || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Threat Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={threatMetrics?.trend_data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
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
                  stroke="#0088FE"
                  fill="#0088FE"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Geographic Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={threatMetrics?.geographic_data}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="country"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Bar dataKey="count" fill="#0088FE">
                  {threatMetrics?.geographic_data.map((entry, index) => (
                    <Cell key={entry.country} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Threats by Type</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {threatTypeData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Threats by Severity</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}; 