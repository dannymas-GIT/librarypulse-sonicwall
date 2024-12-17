import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Shield, AlertTriangle, TrendingUp, PieChart } from 'lucide-react';
import { ThreatMetrics } from '../../types/security';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ThreatMetricsPanelProps {
  data: ThreatMetrics;
}

export const ThreatMetricsPanel: React.FC<ThreatMetricsPanelProps> = ({ data }) => {
  const chartData = {
    labels: data.trend_data.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Threats',
        data: data.trend_data.map(d => d.count),
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
        text: '24-Hour Threat Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-900">Total Threats Blocked</span>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {data.total_threats_blocked.toLocaleString()}
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-900">Critical Threats</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">
            {data.threats_by_severity.critical.toLocaleString()}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Top Threat Type</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            Malware ({data.threats_by_type.malware})
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Prevention Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-700">99.9%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Threats by Type</h3>
          <div className="space-y-4">
            {Object.entries(data.threats_by_type).map(([type, count]) => (
              <div key={type} className="flex items-center">
                <div className="w-32 font-medium capitalize">{type}</div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${(count / data.total_threats_blocked) * 100}%`,
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Threat Severity Distribution</h3>
          <div className="space-y-4">
            {Object.entries(data.threats_by_severity).map(([severity, count]) => (
              <div key={severity} className="flex items-center">
                <div className="w-32 font-medium capitalize">{severity}</div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        severity === 'critical'
                          ? 'bg-red-500'
                          : severity === 'high'
                          ? 'bg-orange-500'
                          : severity === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{
                        width: `${(count / data.total_threats_blocked) * 100}%`,
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
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}; 