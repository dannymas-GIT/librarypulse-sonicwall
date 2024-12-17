import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Key,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Package,
  Users,
  Shield,
  Activity
} from 'lucide-react';
import { mockSecurityService } from '../../services/mockSecurityService';

export const Licensing: React.FC = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ['securityServices'],
    queryFn: mockSecurityService.getSecurityServicesStatus
  });

  const { data: avStatus } = useQuery({
    queryKey: ['gatewayAv'],
    queryFn: mockSecurityService.getGatewayAvStatus
  });

  const { data: ipsStatus } = useQuery({
    queryKey: ['ipsStatus'],
    queryFn: mockSecurityService.getIpsStatus
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900" />
      </div>
    );
  }

  const getLicenseStatus = (service: string) => {
    if (!services) return 'unknown';
    const status = services[service as keyof typeof services];
    if (status?.includes('Licensed')) return 'active';
    return 'inactive';
  };

  const getExpirationDate = (dateString: string) => {
    const date = new Date(dateString.replace('UTC ', ''));
    const now = new Date();
    const daysRemaining = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      date: date.toLocaleDateString(),
      daysRemaining,
      status: daysRemaining < 30 ? 'warning' : 'good'
    };
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">License Management</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
          <Activity className="w-5 h-5" />
          <span className="font-medium">Licenses Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Active Licenses</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {Object.values(services || {}).filter(v => v.includes('Licensed')).length}
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-900">Next Expiration</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">
            {getExpirationDate(avStatus?.gateway_anti_virus_expiration_date || '').daysRemaining} days
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Licensed Users</span>
          </div>
          <p className="text-2xl font-bold text-green-700">Unlimited</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Features</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {Object.keys(services || {}).length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Security Services Status</h3>
          <div className="space-y-4">
            {Object.entries(services || {}).map(([key, value]) => {
              const isLicensed = value.includes('Licensed');
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className={`w-5 h-5 ${isLicensed ? 'text-green-600' : 'text-red-600'}`} />
                    <span className="font-medium">{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLicensed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`text-sm ${isLicensed ? 'text-green-600' : 'text-red-600'}`}>
                      {value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">License Expiration Status</h3>
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Gateway Anti-Virus</div>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-gray-900">
                  {getExpirationDate(avStatus?.gateway_anti_virus_expiration_date || '').date}
                </div>
                <div className={`flex items-center gap-2 ${
                  getExpirationDate(avStatus?.gateway_anti_virus_expiration_date || '').status === 'warning'
                    ? 'text-orange-600'
                    : 'text-green-600'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                  <span>{getExpirationDate(avStatus?.gateway_anti_virus_expiration_date || '').daysRemaining} days remaining</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Intrusion Prevention</div>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-gray-900">
                  {getExpirationDate(ipsStatus?.ips_service_expiration_date || '').date}
                </div>
                <div className={`flex items-center gap-2 ${
                  getExpirationDate(ipsStatus?.ips_service_expiration_date || '').status === 'warning'
                    ? 'text-orange-600'
                    : 'text-green-600'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                  <span>{getExpirationDate(ipsStatus?.ips_service_expiration_date || '').daysRemaining} days remaining</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">License Summary</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Features</div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">{Object.keys(services || {}).length}</span>
                <span className="text-sm text-gray-600">Available Features</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Licensed Features</div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  {Object.values(services || {}).filter(v => v.includes('Licensed')).length}
                </span>
                <span className="text-sm text-gray-600">Active Licenses</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">License Utilization</div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${(Object.values(services || {}).filter(v => v.includes('Licensed')).length / Object.keys(services || {}).length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">License Actions</h3>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2">
              <Key className="w-5 h-5" />
              <span>Update License</span>
            </button>
            <button className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Activate Features</span>
            </button>
            <button className="w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 flex items-center justify-center gap-2">
              <Package className="w-5 h-5" />
              <span>View Available Features</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 