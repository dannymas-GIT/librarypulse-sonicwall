import {
  SecurityServicesStatus,
  GatewayAntiVirusStatus,
  IntrusionPreventionStatus,
  BotnetStatus,
  ContentFilteringStatus,
  AntiSpywareStatus,
  SecurityLog,
  LogsResponse,
  LogFilter,
  ThreatMetrics,
  IPSMetrics,
  VPNMetrics,
  SystemPerformance
} from '../types/security';

const generateRandomTimestamps = (count: number, hoursBack: number = 24) => {
  const timestamps = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (hoursBack * 3600000 * (i / count)));
    timestamps.push(timestamp.toISOString());
  }
  return timestamps.sort();
};

export const mockSecurityService = {
  getSecurityServicesStatus: async (): Promise<SecurityServicesStatus> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      nodes_users: "Licensed - Unlimited Nodes",
      ssl_vpn_nodes_users: "Licensed - 12 Nodes(0 in use)",
      virtual_assist_nodes_users: "Licensed - 0 Nodes(0 in use)",
      vpn: "Licensed",
      global_vpn_client: "Licensed - 10 Licenses(1 in use)",
      cfs_content_filter_: "Licensed",
      expanded_feature_set: "Not Licensed",
      endpoint_security: "Not Licensed",
      gateway_anti_virus: "Licensed",
      capture_atp: "Licensed",
      anti_spyware: "Licensed",
      intrusion_prevention: "Licensed",
      app_control: "Licensed",
      app_visualization: "Licensed",
      anti_spam: "Licensed",
      analyzer: "Not Licensed",
      dpi_ssl: "Licensed - Client/Server",
      dpi_ssh: "Licensed",
      wan_acceleration: "Not Licensed",
      wxac_acceleration: "Licensed",
      botnet: "Licensed",
      dns_filtering: "Licensed"
    };
  },

  getGatewayAvStatus: async (): Promise<GatewayAntiVirusStatus> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      signature_database: "Downloaded",
      signature_database_timestamp: "UTC 12/12/2024 15:02:28.000",
      last_checked: "12/13/2024 16:29:02.864",
      gateway_anti_virus_expiration_date: "UTC 04/05/2026 00:00:00.000"
    };
  },

  getIpsStatus: async (): Promise<IntrusionPreventionStatus> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      signature_database: "Downloaded",
      signature_database_timestamp: "UTC 12/12/2024 14:53:13.000",
      last_checked: "12/13/2024 16:29:02.864",
      ips_service_expiration_date: "UTC 04/05/2026 00:00:00.000"
    };
  },

  getBotnetStatus: async (): Promise<BotnetStatus> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      botnet_database: "Downloaded",
      message: "Botnet Filter Available"
    };
  },

  getContentFilteringStatus: async (): Promise<ContentFilteringStatus> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      database_version: "20240112",
      last_updated: "UTC 12/12/2024 15:02:28.000",
      expiration_date: "UTC 04/05/2026 00:00:00.000",
      total_requests_today: 15000,
      total_blocked_today: 150,
      categories: [
        { id: 1, name: "Adult Content", status: "Blocked", hits_today: 25 },
        { id: 2, name: "Business", status: "Allowed", hits_today: 1250 },
        { id: 3, name: "Gambling", status: "Blocked", hits_today: 12 },
        { id: 4, name: "Social Media", status: "Allowed", hits_today: 3450 },
        { id: 5, name: "Malware Sites", status: "Blocked", hits_today: 89 }
      ]
    };
  },

  getAntiSpywareStatus: async (): Promise<AntiSpywareStatus> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      signature_database: "Downloaded",
      signature_database_timestamp: "UTC 12/12/2024 15:02:28.000",
      last_checked: "12/13/2024 16:29:02.864",
      anti_spyware_expiration_date: "UTC 04/05/2026 00:00:00.000",
      active_signatures: 12500,
      blocked_today: 42
    };
  },

  getLogs: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: LogFilter
  ): Promise<LogsResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockLogs: SecurityLog[] = Array.from({ length: 100 }, (_, i) => ({
      time: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      id: i + 1,
      category: ['System', 'Attack', 'Network', 'Policy'][Math.floor(Math.random() * 4)],
      priority: ['Alert', 'Notice', 'Information'][Math.floor(Math.random() * 3)] as SecurityLog['priority'],
      src_int_: Math.random() > 0.5 ? 'X1' : null,
      dst_int_: Math.random() > 0.5 ? 'X0' : null,
      src_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      src_port: Math.floor(Math.random() * 65535),
      dst_ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      dst_port: Math.floor(Math.random() * 65535),
      ip_protocol: Math.random() > 0.5 ? 'TCP' : 'UDP',
      user_name: Math.random() > 0.7 ? `user${Math.floor(Math.random() * 100)}` : null,
      application: Math.random() > 0.6 ? ['HTTP', 'HTTPS', 'SSH', 'FTP'][Math.floor(Math.random() * 4)] : null,
      notes: 'Sample log entry',
      message: [
        'Connection attempt blocked',
        'User authentication successful',
        'Policy violation detected',
        'Service started',
        'Configuration changed'
      ][Math.floor(Math.random() * 5)]
    }));

    let filteredLogs = [...mockLogs];
    
    if (filters) {
      if (filters.startTime) {
        filteredLogs = filteredLogs.filter(log => new Date(log.time) >= new Date(filters.startTime!));
      }
      if (filters.endTime) {
        filteredLogs = filteredLogs.filter(log => new Date(log.time) <= new Date(filters.endTime!));
      }
      if (filters.category) {
        filteredLogs = filteredLogs.filter(log => log.category === filters.category);
      }
      if (filters.priority) {
        filteredLogs = filteredLogs.filter(log => log.priority === filters.priority);
      }
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.message.toLowerCase().includes(searchLower) ||
          log.src_ip.includes(searchLower) ||
          log.dst_ip.includes(searchLower) ||
          (log.user_name?.toLowerCase().includes(searchLower))
        );
      }
    }

    // Sort by time descending
    filteredLogs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    const start = (page - 1) * pageSize;
    const paginatedLogs = filteredLogs.slice(start, start + pageSize);

    return {
      logs: paginatedLogs,
      total: filteredLogs.length
    };
  },

  getThreatMetrics: async (): Promise<ThreatMetrics> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const timestamps = generateRandomTimestamps(24);
    
    return {
      total_threats_blocked: 1247,
      threats_by_type: {
        malware: 456,
        ransomware: 89,
        phishing: 234,
        ddos: 178,
        botnet: 156,
        other: 134
      },
      threats_by_severity: {
        critical: 89,
        high: 234,
        medium: 567,
        low: 357
      },
      geographic_data: [
        { country: 'United States', count: 456, latitude: 37.0902, longitude: -95.7129 },
        { country: 'China', count: 324, latitude: 35.8617, longitude: 104.1954 },
        { country: 'Russia', count: 234, latitude: 61.5240, longitude: 105.3188 },
        { country: 'Brazil', count: 167, latitude: -14.2350, longitude: -51.9253 },
        { country: 'India', count: 145, latitude: 20.5937, longitude: 78.9629 }
      ],
      trend_data: timestamps.map((timestamp, index) => ({
        timestamp,
        count: Math.floor(Math.random() * 100) + 20
      }))
    };
  },

  getIPSMetrics: async (): Promise<IPSMetrics> => {
    await new Promise(resolve => setTimeout(resolve, 700));

    return {
      total_attacks_blocked: 8934,
      attacks_by_category: [
        { category: 'SQL Injection', count: 2345, severity: 'Critical' },
        { category: 'Cross-Site Scripting', count: 1876, severity: 'High' },
        { category: 'Directory Traversal', count: 1234, severity: 'Medium' },
        { category: 'Command Injection', count: 987, severity: 'Critical' },
        { category: 'File Inclusion', count: 876, severity: 'High' }
      ],
      top_attacked_services: [
        { service: 'HTTP', port: 80, count: 3456 },
        { service: 'HTTPS', port: 443, count: 2345 },
        { service: 'SSH', port: 22, count: 1234 },
        { service: 'FTP', port: 21, count: 987 },
        { service: 'SMB', port: 445, count: 876 }
      ],
      signature_coverage: {
        total_signatures: 12500,
        active_signatures: 8934,
        custom_signatures: 45
      },
      performance_impact: {
        latency_ms: 1.2,
        packets_analyzed: 15789234,
        packets_dropped: 234
      }
    };
  },

  getVPNMetrics: async (): Promise<VPNMetrics> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    return {
      active_sessions: 47,
      total_users: 89,
      bandwidth_usage: {
        incoming_mbps: 156.7,
        outgoing_mbps: 98.4
      },
      session_data: Array.from({ length: 10 }, (_, i) => ({
        user: `user${i + 1}@company.com`,
        ip_address: `192.168.1.${100 + i}`,
        duration: Math.floor(Math.random() * 7200),
        bytes_transferred: Math.floor(Math.random() * 1000000000),
        last_activity: new Date(Date.now() - Math.random() * 3600000).toISOString()
      })),
      protocols: [
        { name: 'IPSec', sessions: 23 },
        { name: 'SSL VPN', sessions: 15 },
        { name: 'L2TP', sessions: 9 }
      ]
    };
  },

  getSystemPerformance: async (): Promise<SystemPerformance> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const timestamps = generateRandomTimestamps(60, 1); // Last hour, minute by minute

    return {
      cpu_usage: 45.7,
      memory_usage: {
        total_mb: 16384,
        used_mb: 12288,
        free_mb: 4096
      },
      network_throughput: timestamps.map(timestamp => ({
        timestamp,
        incoming_mbps: Math.random() * 1000,
        outgoing_mbps: Math.random() * 800
      })),
      interface_stats: [
        {
          name: 'X1',
          status: 'Up',
          packets_in: 15789234,
          packets_out: 14567890,
          errors_in: 23,
          errors_out: 12
        },
        {
          name: 'X2',
          status: 'Up',
          packets_in: 12345678,
          packets_out: 11234567,
          errors_in: 15,
          errors_out: 8
        },
        {
          name: 'X3',
          status: 'Down',
          packets_in: 0,
          packets_out: 0,
          errors_in: 0,
          errors_out: 0
        }
      ]
    };
  }
}; 