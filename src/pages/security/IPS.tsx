import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockSecurityService } from '../../services/mockSecurityService';
import { IPSMetrics } from '../../types/security';

export const IPS: React.FC = () => {
  const { data: ipsMetrics, isLoading } = useQuery<IPSMetrics>({
    queryKey: ['ipsMetrics'],
    queryFn: mockSecurityService.getIPSMetrics
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!ipsMetrics) {
    return <div>No metrics available</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">IPS Metrics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Attacks Blocked</h2>
          <p className="text-3xl font-bold text-blue-600">
            {ipsMetrics.total_attacks_blocked.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Active Signatures</h2>
          <p className="text-3xl font-bold text-green-600">
            {ipsMetrics.signature_coverage.active_signatures.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Critical Attacks</h2>
          <p className="text-3xl font-bold text-red-600">
            {ipsMetrics.attacks_by_category
              .filter(a => a.severity === 'Critical')
              .reduce((sum, a) => sum + a.count, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Performance Impact</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Latency</p>
              <p className="text-xl font-semibold">
                {ipsMetrics.performance_impact.latency_ms.toFixed(2)} ms
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Packets Analyzed</p>
              <p className="text-xl font-semibold">
                {ipsMetrics.performance_impact.packets_analyzed.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Packets Dropped</p>
              <p className="text-xl font-semibold">
                {ipsMetrics.performance_impact.packets_dropped.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Attacked Services</h2>
          <div className="space-y-2">
            {ipsMetrics.top_attacked_services.map(({ service, port, count }) => (
              <div key={`${service}-${port}`} className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">
                    {service} (Port {port})
                  </span>
                  <span className="text-sm text-gray-600">
                    {count.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(count / ipsMetrics.total_attacks_blocked) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 