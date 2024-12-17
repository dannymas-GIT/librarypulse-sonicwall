import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, AlertTriangle, Activity, Database } from 'lucide-react';
import { mockSecurityService } from '../../services/mockSecurityService';
import { ThreatMap } from '../../components/security/ThreatMap';
import { ThreatMetricsPanel } from '../../components/security/ThreatMetricsPanel';

export const IPS: React.FC = () => {
  const { data: threatMetrics, isLoading: isLoadingThreats } = useQuery({
    queryKey: ['threatMetrics'],
    queryFn: mockSecurityService.getThreatMetrics
  });

  const { data: ipsMetrics, isLoading: isLoadingIPS } = useQuery({
    queryKey: ['ipsMetrics'],
    queryFn: mockSecurityService.getIPSMetrics
  });

  const isLoading = isLoadingThreats || isLoadingIPS;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Intrusion Prevention System</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
          <Activity className="w-5 h-5" />
          <span className="font-medium">System Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Total Attacks Blocked</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {ipsMetrics?.total_attacks_blocked.toLocaleString()}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Active Signatures</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {ipsMetrics?.signature_coverage.active_signatures.toLocaleString()}
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-900">Critical Attacks</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">
            {ipsMetrics?.attacks_by_category
              .filter(a => a.severity === 'Critical')
              .reduce((sum, a) => sum + a.count, 0)
              .toLocaleString()}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Packets Analyzed</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {ipsMetrics?.performance_impact.packets_analyzed.toLocaleString()}
          </p>
        </div>
      </div>

      {threatMetrics && <ThreatMetricsPanel data={threatMetrics} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {threatMetrics && <ThreatMap data={threatMetrics.geographic_data} />}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Top Attacked Services</h3>
          <div className="space-y-4">
            {ipsMetrics?.top_attacked_services.map(({ service, port, count }) => (
              <div key={`${service}-${port}`} className="flex items-center">
                <div className="w-32 font-medium">
                  {service}
                  <span className="text-sm text-gray-500 ml-1">:{port}</span>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(count / ipsMetrics.total_attacks_blocked) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right text-sm text-gray-600">
                  {count.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">System Performance Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Average Latency</div>
            <div className="text-2xl font-bold text-gray-900">
              {ipsMetrics?.performance_impact.latency_ms.toFixed(2)} ms
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Packets Analyzed</div>
            <div className="text-2xl font-bold text-gray-900">
              {ipsMetrics?.performance_impact.packets_analyzed.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Packets Dropped</div>
            <div className="text-2xl font-bold text-gray-900">
              {ipsMetrics?.performance_impact.packets_dropped.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 