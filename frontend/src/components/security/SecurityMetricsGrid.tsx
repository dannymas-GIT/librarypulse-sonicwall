import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, AlertTriangle, Activity, Database } from 'lucide-react';
import { mockSecurityService } from '../../services/mockSecurityService';

export const SecurityMetricsGrid: React.FC = () => {
  const { data: antiSpyware } = useQuery({
    queryKey: ['antiSpyware'],
    queryFn: mockSecurityService.getAntiSpywareStatus
  });

  const { data: contentFiltering } = useQuery({
    queryKey: ['contentFiltering'],
    queryFn: mockSecurityService.getContentFilteringStatus
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Security Metrics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Active Signatures</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {antiSpyware?.active_signatures.toLocaleString() || '0'}
          </p>
        </div>

        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-900">Threats Blocked</span>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {antiSpyware?.blocked_today || '0'}
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Requests Processed</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {contentFiltering?.total_requests_today.toLocaleString() || '0'}
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Database Version</span>
          </div>
          <p className="text-lg font-bold text-purple-700">
            {contentFiltering?.database_version || 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  );
}; 