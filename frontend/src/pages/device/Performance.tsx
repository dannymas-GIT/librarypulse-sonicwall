import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Cpu,
  CircuitBoard,
  Network,
  Activity,
  Clock,
  Zap,
  HardDrive,
  AlertTriangle,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { mockSecurityService } from '../../services/mockSecurityService';

export const Performance: React.FC = () => {
  const { data: performance, isLoading } = useQuery({
    queryKey: ['systemPerformance'],
    queryFn: mockSecurityService.getSystemPerformance,
    refetchInterval: 5000
  });

  if (isLoading || !performance) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900" />
      </div>
    );
  }

  const networkChartData = {
    labels: performance.network_throughput.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Incoming Traffic',
        data: performance.network_throughput.map(d => d.incoming_mbps),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Outgoing Traffic',
        data: performance.network_throughput.map(d => d.outgoing_mbps),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Network Throughput (Last Hour)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Mbps',
        },
      },
    },
  };

  const memoryUsagePercentage = (performance.memory_usage.used_mb / performance.memory_usage.total_mb) * 100;
  const cpuUsage = performance.cpu_usage;
  const currentIncomingTraffic = performance.network_throughput[performance.network_throughput.length - 1]?.incoming_mbps || 0;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Performance Metrics</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
          <Activity className="w-5 h-5" />
          <span className="font-medium">System Optimal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">CPU Load</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {cpuUsage.toFixed(1)}%
          </p>
          <p className="text-sm text-blue-600 mt-1">
            {cpuUsage > 80 ? 'High Load' : 
             cpuUsage > 60 ? 'Moderate Load' : 'Normal Load'}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CircuitBoard className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Memory Usage</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {memoryUsagePercentage.toFixed(1)}%
          </p>
          <p className="text-sm text-green-600 mt-1">
            {performance.memory_usage.free_mb.toLocaleString()} MB Available
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Network Load</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {currentIncomingTraffic.toFixed(1)} Mbps
          </p>
          <p className="text-sm text-purple-600 mt-1">Current Incoming Traffic</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-900">Response Time</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">1.2 ms</p>
          <p className="text-sm text-orange-600 mt-1">Average Latency</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Network Performance</h3>
          <div className="h-[400px]">
            <Line data={networkChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Resource Utilization</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>CPU Utilization</span>
                <span>{cpuUsage.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className={`h-full rounded-full ${
                    cpuUsage > 80
                      ? 'bg-red-500'
                      : cpuUsage > 60
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${cpuUsage}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Memory Usage</span>
                <span>{memoryUsagePercentage.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${memoryUsagePercentage}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Network Bandwidth</span>
                <span>{Math.max(...performance.network_throughput.map(d => d.incoming_mbps + d.outgoing_mbps)).toFixed(1)} Mbps</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: "45%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">System Health Indicators</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                <span>System Performance</span>
              </div>
              <span className="text-green-600 font-medium">Optimal</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-green-600" />
                <span>Resource Availability</span>
              </div>
              <span className="text-green-600 font-medium">Good</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span>System Load</span>
              </div>
              <span className="text-orange-600 font-medium">Moderate</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-green-600" />
                <span>Network Status</span>
              </div>
              <span className="text-green-600 font-medium">Stable</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>CPU Trend</span>
              </div>
              <span className="text-sm text-gray-600">+2.3% from last hour</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span>Memory Trend</span>
              </div>
              <span className="text-sm text-gray-600">+5.7% from last hour</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Network Trend</span>
              </div>
              <span className="text-sm text-gray-600">-1.2% from last hour</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Alerts</h3>
          <div className="space-y-4">
            {[
              { message: 'CPU spike detected', time: '10 minutes ago', severity: 'warning' },
              { message: 'Memory usage increased', time: '25 minutes ago', severity: 'info' },
              { message: 'Network latency normal', time: '1 hour ago', severity: 'success' }
            ].map((alert, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 className={`w-5 h-5 ${
                    alert.severity === 'warning' ? 'text-orange-600' :
                    alert.severity === 'info' ? 'text-blue-600' : 'text-green-600'
                  }`} />
                  <span>{alert.message}</span>
                </div>
                <span className="text-sm text-gray-600">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 