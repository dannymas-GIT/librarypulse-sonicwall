import React, { useState, useEffect } from 'react';
import { SecurityLog } from '../types/security';
import { SecurityLogTable } from '../components/security/SecurityLogTable';
import { mockSecurityService } from '../services/mockSecurityService';

export const SecurityDashboard: React.FC = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await mockSecurityService.getLogs(1, 100);
        setLogs(response.logs);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleUpdateLog = (logId: string, updates: Partial<SecurityLog>) => {
    setLogs(prevLogs => 
      prevLogs.map(log => 
        log.id === logId ? { ...log, ...updates } : log
      )
    );
  };

  const handleAnalyzeLogs = async (logsToAnalyze: SecurityLog[]) => {
    // Implement log analysis logic here
    console.log('Analyzing logs:', logsToAnalyze);
  };

  if (isLoading) {
    return <div className="text-gray-500">Loading logs...</div>;
  }

  return (
    <div>
      <SecurityLogTable 
        logs={logs} 
        onUpdateLog={handleUpdateLog} 
        onAnalyzeLogs={handleAnalyzeLogs} 
      />
    </div>
  );
};