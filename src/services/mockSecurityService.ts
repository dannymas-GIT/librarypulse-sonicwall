import { SecurityLog, LogsResponse } from '../types/security';

export const mockSecurityService = {
  getLogs: async (page: number = 1, pageSize: number = 10): Promise<LogsResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockLogs: SecurityLog[] = Array.from({ length: 100 }, (_, i) => ({
      id: String(i + 1),
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      category: ['System', 'Attack', 'Network', 'Policy'][Math.floor(Math.random() * 4)],
      severity: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
      message: [
        'Connection attempt blocked',
        'User authentication successful',
        'Policy violation detected',
        'Service started',
        'Configuration changed'
      ][Math.floor(Math.random() * 5)],
      source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    }));

    const start = (page - 1) * pageSize;
    const paginatedLogs = mockLogs.slice(start, start + pageSize);

    return {
      logs: paginatedLogs,
      total: mockLogs.length
    };
  }
};