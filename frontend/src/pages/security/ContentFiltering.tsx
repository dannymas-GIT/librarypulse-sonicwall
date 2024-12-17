import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import {
  Filter,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Activity,
  BarChart
} from 'lucide-react';
import { mockSecurityService } from '../../services/mockSecurityService';

export const ContentFiltering: React.FC = () => {
  const { data: contentFiltering, isLoading } = useQuery({
    queryKey: ['contentFiltering'],
    queryFn: mockSecurityService.getContentFilteringStatus,
    refetchInterval: 30000
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900" />
      </div>
    );
  }

  const chartData = {
    labels: contentFiltering?.categories.map(c => c.name) || [],
    datasets: [
      {
        label: 'Hits Today',
        data: contentFiltering?.categories.map(c => c.hits_today) || [],
        backgroundColor: contentFiltering?.categories.map(c => 
          c.status === 'Blocked' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 197, 94, 0.5)'
        ),
        borderColor: contentFiltering?.categories.map(c => 
          c.status === 'Blocked' ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Category Activity',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Content Filtering</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
          <Activity className="w-5 h-5" />
          <span className="font-medium">Service Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Total Requests</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {contentFiltering?.total_requests_today.toLocaleString()}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-900">Blocked Requests</span>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {contentFiltering?.total_blocked_today.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Block Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {((contentFiltering?.total_blocked_today || 0) / (contentFiltering?.total_requests_today || 1) * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Categories</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {contentFiltering?.categories.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Category Statistics</h3>
          <div className="h-[400px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Category Details</h3>
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hits Today</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contentFiltering?.categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{category.name}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.status === 'Blocked'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {category.hits_today.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {((category.hits_today / contentFiltering.total_requests_today) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Database Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Database Version</div>
            <div className="text-2xl font-bold text-gray-900">
              {contentFiltering?.database_version}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Last Updated</div>
            <div className="text-2xl font-bold text-gray-900">
              {new Date(contentFiltering?.last_updated || '').toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Expiration Date</div>
            <div className="text-2xl font-bold text-gray-900">
              {new Date(contentFiltering?.expiration_date || '').toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 