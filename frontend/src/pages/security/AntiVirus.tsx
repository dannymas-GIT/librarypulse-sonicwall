import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Shield,
  Bug,
  Database,
  RefreshCw,
  Activity,
  FileSearch,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { mockSecurityService } from '../../services/mockSecurityService';

export const AntiVirus: React.FC = () => {
  const { data: avStatus, isLoading: isLoadingAv } = useQuery({
    queryKey: ['gatewayAv'],
    queryFn: mockSecurityService.getGatewayAvStatus
  });

  const { data: threatMetrics, isLoading: isLoadingThreats } = useQuery({
    queryKey: ['threatMetrics'],
    queryFn: mockSecurityService.getThreatMetrics
  });

  const isLoading = isLoadingAv || isLoadingThreats;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900" />
      </div>
    );
  }

  // Last 24 hours threat trend chart data
  const chartData = {
    labels: threatMetrics?.trend_data.map(d => new Date(d.timestamp).toLocaleTimeString()) || [],
    datasets: [
      {
        label: 'Malware Detections',
        data: threatMetrics?.trend_data.map(d => d.count) || [],
        fill: true,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
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
        text: '24-Hour Detection Trend',
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
        <h1 className="text-2xl font-bold">Gateway Anti-Virus</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
          <Activity className="w-5 h-5" />
          <span className="font-medium">Protection Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bug className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-900">Malware Detected</span>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {threatMetrics?.threats_by_type.malware.toLocaleString()}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Signature Database</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {avStatus?.signature_database}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Protection Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-700">99.8%</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileSearch className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Files Scanned</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">1.2M</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Detection Trend</h3>
          <div className="h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Detections</h3>
          <div className="space-y-4">
            {[
              { file: 'download.exe', type: 'Trojan', timestamp: '2 minutes ago', severity: 'Critical' },
              { file: 'document.pdf', type: 'Ransomware', timestamp: '15 minutes ago', severity: 'Critical' },
              { file: 'setup.msi', type: 'Adware', timestamp: '1 hour ago', severity: 'Medium' },
              { file: 'image.jpg', type: 'Malware', timestamp: '2 hours ago', severity: 'High' },
              { file: 'archive.zip', type: 'Spyware', timestamp: '3 hours ago', severity: 'Medium' }
            ].map((detection, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <AlertTriangle className={`w-5 h-5 ${
                    detection.severity === 'Critical' ? 'text-red-600' :
                    detection.severity === 'High' ? 'text-orange-600' : 'text-yellow-600'
                  }`} />
                  <div>
                    <div className="font-medium">{detection.file}</div>
                    <div className="text-sm text-gray-600">{detection.type}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{detection.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Signature Database Status</h3>
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Last Updated</div>
              <div className="text-xl font-bold text-gray-900">
                {new Date(avStatus?.signature_database_timestamp || '').toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Last Check</div>
              <div className="text-xl font-bold text-gray-900">
                {new Date(avStatus?.last_checked || '').toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Expiration Date</div>
              <div className="text-xl font-bold text-gray-900">
                {new Date(avStatus?.gateway_anti_virus_expiration_date || '').toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Scan Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Clean Files</span>
              </div>
              <span className="font-medium">98.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span>Suspicious Files</span>
              </div>
              <span className="font-medium">1.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-red-600" />
                <span>Infected Files</span>
              </div>
              <span className="font-medium">0.3%</span>
            </div>
            <div className="mt-6">
              <div className="text-sm text-gray-600 mb-2">Scan Performance Impact</div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full w-[15%] bg-green-500 rounded-full"></div>
              </div>
              <div className="text-sm text-gray-600 mt-1">Low Impact (15%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 