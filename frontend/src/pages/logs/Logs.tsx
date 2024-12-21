import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SecurityLog, LogsResponse } from '../../types/security';
import { mockSecurityService } from '../../services/mockSecurityService';
import { SecurityLogTable } from '../../components/security/SecurityLogTable';

export const Logs: React.FC = () => {
  const { data, isLoading } = useQuery<LogsResponse>({
    queryKey: ['logs'],
    queryFn: async () => mockSecurityService.getLogs(1, 100)
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const logs = data?.logs || [];
  const innocuousCount = logs.filter((log: SecurityLog) => log.isInnocuous).length;
  const nonInnocuousLogs = logs.filter((log: SecurityLog) => !log.isInnocuous);

  const handleUpdateLog = async (logId: string, updates: Partial<SecurityLog>) => {
    // In a real app, this would call an API endpoint
    console.log('Updating log:', logId, updates);
  };

  const handleAnalyzeLogs = async (logsToAnalyze: SecurityLog[]) => {
    // In a real app, this would call an AI analysis endpoint
    console.log('Analyzing logs:', logsToAnalyze);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Security Logs</h1>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Total Logs: {logs.length}</span>
          <span>Marked Safe: {innocuousCount}</span>
          <span>Potential Threats: {logs.length - innocuousCount}</span>
        </div>
      </div>
      <SecurityLogTable
        logs={logs}
        onUpdateLog={handleUpdateLog}
        onAnalyzeLogs={handleAnalyzeLogs}
      />
    </div>
  );
}; 