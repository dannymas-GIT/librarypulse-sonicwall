import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Check, AlertTriangle } from 'lucide-react';
import { mockSecurityService } from '../services/mockSecurityService';

export const Licensing: React.FC = () => {
  const { data: securityServices, isLoading } = useQuery({
    queryKey: ['securityServices'],
    queryFn: mockSecurityService.getSecurityServicesStatus
  });

  if (isLoading || !securityServices) {
    return <div>Loading...</div>;
  }

  const getLicenseStatus = (status: string) => {
    if (status.includes('Licensed')) {
      return {
        color: 'bg-green-100 text-green-800',
        icon: <Check className="h-4 w-4" />
      };
    }
    return {
      color: 'bg-red-100 text-red-800',
      icon: <AlertTriangle className="h-4 w-4" />
    };
  };

  const formatLicenseText = (text: string) => {
    return text.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const groupedServices = Object.entries(securityServices).reduce((acc, [key, value]) => {
    const category = key.includes('vpn') || key.includes('nodes') ? 'Network Access' :
                    key.includes('filter') ? 'Content Security' :
                    key.includes('anti') || key.includes('prevention') ? 'Threat Protection' :
                    'Advanced Features';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ key, value });
    return acc;
  }, {} as Record<string, Array<{ key: string, value: string }>>);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Licensing Status</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(groupedServices).map(([category, services]) => (
          <div key={category} className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">{category}</h2>
            <div className="space-y-4">
              {services.map(({ key, value }) => {
                const status = getLicenseStatus(value);
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{formatLicenseText(key)}</span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.icon}
                        {value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">License Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Licensed Features</p>
            <p className="text-2xl font-semibold">
              {Object.values(securityServices).filter(v => v.includes('Licensed')).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Unlicensed Features</p>
            <p className="text-2xl font-semibold">
              {Object.values(securityServices).filter(v => !v.includes('Licensed')).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">License Utilization</p>
            <p className="text-2xl font-semibold">
              {Math.round((Object.values(securityServices).filter(v => v.includes('Licensed')).length / 
                Object.values(securityServices).length) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 