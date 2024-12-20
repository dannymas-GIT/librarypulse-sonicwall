import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, AlertTriangle, Activity } from 'lucide-react';
import { mockSecurityService } from '../../services/mockSecurityService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const ContentFiltering: React.FC = () => {
  const { data: contentFiltering, isLoading } = useQuery({
    queryKey: ['contentFiltering'],
    queryFn: mockSecurityService.getContentFilteringStatus
  });

  if (isLoading || !contentFiltering) {
    return <div>Loading...</div>;
  }

  const categoryData = contentFiltering.categories.map(category => ({
    name: category.name,
    hits: category.hits_today,
    status: category.status
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Content Filtering</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Requests Today</h3>
              <p className="text-2xl font-semibold">{contentFiltering.total_requests_today.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Blocked Today</h3>
              <p className="text-2xl font-semibold">{contentFiltering.total_blocked_today.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Database Version</h3>
              <p className="text-2xl font-semibold">{contentFiltering.database_version}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Category Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hits" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Status Overview</h2>
          <div className="space-y-4">
            {contentFiltering.categories.map(category => (
              <div key={category.id} className="flex justify-between items-center">
                <span className="text-sm font-medium">{category.name}</span>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    category.status === 'Blocked' 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {category.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {category.hits_today.toLocaleString()} hits
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Database Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-lg font-medium">{new Date(contentFiltering.last_updated).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Database Version</p>
            <p className="text-lg font-medium">{contentFiltering.database_version}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expiration Date</p>
            <p className="text-lg font-medium">{new Date(contentFiltering.expiration_date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 