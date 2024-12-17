import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock } from 'lucide-react';
import { mockSecurityService } from '../../services/mockSecurityService';

export const ServiceExpirationCard: React.FC = () => {
  const { data: gatewayAv } = useQuery({
    queryKey: ['gatewayAv'],
    queryFn: mockSecurityService.getGatewayAvStatus
  });

  const { data: ips } = useQuery({
    queryKey: ['ips'],
    queryFn: mockSecurityService.getIpsStatus
  });

  const formatExpirationDate = (dateString: string) => {
    const date = new Date(dateString.replace('UTC ', ''));
    const now = new Date();
    const daysRemaining = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      date: date.toLocaleDateString(),
      daysRemaining
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-6 h-6 text-primary-600" />
        <h3 className="text-lg font-semibold">Service Expiration Dates</h3>
      </div>
      
      <div className="space-y-4">
        {gatewayAv && (
          <div>
            <h4 className="font-medium">Gateway Anti-Virus</h4>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-600">
                Expires: {formatExpirationDate(gatewayAv.gateway_anti_virus_expiration_date).date}
              </span>
              <span className={`text-sm font-medium ${
                formatExpirationDate(gatewayAv.gateway_anti_virus_expiration_date).daysRemaining < 30
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}>
                {formatExpirationDate(gatewayAv.gateway_anti_virus_expiration_date).daysRemaining} days remaining
              </span>
            </div>
          </div>
        )}

        {ips && (
          <div>
            <h4 className="font-medium">Intrusion Prevention</h4>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-600">
                Expires: {formatExpirationDate(ips.ips_service_expiration_date).date}
              </span>
              <span className={`text-sm font-medium ${
                formatExpirationDate(ips.ips_service_expiration_date).daysRemaining < 30
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}>
                {formatExpirationDate(ips.ips_service_expiration_date).daysRemaining} days remaining
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 