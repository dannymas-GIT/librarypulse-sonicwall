import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Shield,
  AlertTriangle,
  Activity,
  Globe,
  Zap,
  Target,
  BarChart2,
  Lock
} from 'lucide-react';
import { mockSecurityService } from '../../services/mockSecurityService';
import { ThreatMap } from '../../components/security/ThreatMap';
import { ThreatMetricsPanel } from '../../components/security/ThreatMetricsPanel';

export const ThreatPrevention: React.FC = () => {
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
        <h1 className="text-2xl font-bold">Threat Prevention</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
          <Activity className="w-5 h-5" />
          <span className="font-medium">Active Protection</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-900">Total Threats</span>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {threatMetrics?.total_threats_blocked.toLocaleString()}
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-900">Critical Threats</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">
            {threatMetrics?.threats_by_severity.critical.toLocaleString()}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Source Countries</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {threatMetrics?.geographic_data.length}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Response Time</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {ipsMetrics?.performance_impact.latency_ms.toFixed(1)} ms
          </p>
        </div>
      </div>

      <ThreatMetricsPanel data={threatMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatMap data={threatMetrics.geographic_data} />

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Attack Categories</h3>
          <div className="space-y-4">
            {ipsMetrics?.attacks_by_category.map(({ category, count, severity }) => (
              <div key={category} className="flex items-center">
                <div className="w-40 font-medium">{category}</div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        severity === 'Critical'
                          ? 'bg-red-500'
                          : severity === 'High'
                          ? 'bg-orange-500'
                          : 'bg-yellow-500'
                      }`}
                      style={{
                        width: `${(count / ipsMetrics.total_attacks_blocked) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="w-32 text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    severity === 'Critical'
                      ? 'bg-red-100 text-red-800'
                      : severity === 'High'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {severity}
                  </span>
                </div>
                <div className="w-24 text-right text-sm text-gray-600">
                  {count.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Protection Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>IPS</span>
              </div>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                <span>Anti-Virus</span>
              </div>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                <span>Anti-Spyware</span>
              </div>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-green-600" />
                <span>Botnet Filter</span>
              </div>
              <span className="text-green-600 font-medium">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">System Impact</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>CPU Usage</span>
                <span>15%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full w-[15%] bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Memory Usage</span>
                <span>25%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full w-[25%] bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Network Impact</span>
                <span>8%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full w-[8%] bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Signature Coverage</h3>
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Signatures</div>
              <div className="text-2xl font-bold text-gray-900">
                {ipsMetrics?.signature_coverage.total_signatures.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Active Signatures</div>
              <div className="text-2xl font-bold text-gray-900">
                {ipsMetrics?.signature_coverage.active_signatures.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Custom Signatures</div>
              <div className="text-2xl font-bold text-gray-900">
                {ipsMetrics?.signature_coverage.custom_signatures.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 