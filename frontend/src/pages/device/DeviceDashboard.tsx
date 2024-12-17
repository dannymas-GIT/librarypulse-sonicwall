import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Cpu,
  CircuitBoard,
  HardDrive,
  Network,
  Activity,
  ArrowUp,
  ArrowDown,
  AlertTriangle
} from 'lucide-react';
import { mockSecurityService } from '../../services/mockSecurityService';

export const DeviceDashboard: React.FC = () => {
  const { data: performance, isLoading } = useQuery({
    queryKey: ['systemPerformance'],
    queryFn: mockSecurityService.getSystemPerformance,
    refetchInterval: 5000 // Refresh every 5 seconds
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
        text: 'Network Throughput',
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

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Device Overview</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
          <Activity className="w-5 h-5" />
          <span className="font-medium">System Healthy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">CPU Usage</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {cpuUsage.toFixed(1)}%
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
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Active Interfaces</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {performance.interface_stats.filter(i => i.status === 'Up').length}
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-900">Interface Errors</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">
            {performance.interface_stats.reduce((sum, i) => sum + i.errors_in + i.errors_out, 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Network Throughput</h3>
          <div className="h-[400px]">
            <Line data={networkChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Interface Status</h3>
          <div className="space-y-4">
            {performance.interface_stats.map((iface) => (
              <div key={iface.name} className="flex items-center">
                <div className="w-20 font-medium">{iface.name}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      iface.status === 'Up'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {iface.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <ArrowDown className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">
                        {iface.packets_in.toLocaleString()} pkts
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        {iface.packets_out.toLocaleString()} pkts
                      </span>
                    </div>
                    {(iface.errors_in > 0 || iface.errors_out > 0) && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-orange-600">
                          {(iface.errors_in + iface.errors_out).toLocaleString()} errors
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Memory Allocation</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Used Memory</span>
                <span>{performance.memory_usage.used_mb.toLocaleString()} MB</span>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Memory</div>
                <div className="text-xl font-bold text-gray-900">
                  {performance.memory_usage.total_mb.toLocaleString()} MB
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Free Memory</div>
                <div className="text-xl font-bold text-gray-900">
                  {performance.memory_usage.free_mb.toLocaleString()} MB
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>CPU Load</span>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">System Uptime</div>
                <div className="text-xl font-bold text-gray-900">15d 7h 23m</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Last Boot</div>
                <div className="text-xl font-bold text-gray-900">Dec 1, 2023</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 