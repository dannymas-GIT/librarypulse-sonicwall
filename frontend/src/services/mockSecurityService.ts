import {
  SecurityServicesStatus,
  ContentFilteringStatus,
  AntiSpywareStatus,
  SecurityLog,
  LogsResponse,
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
  getSecurityLogs: async (): Promise<SecurityLog[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1),
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      category: ['System', 'Attack', 'Network', 'Policy'][Math.floor(Math.random() * 4)],
      severity: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
      message: [
        'Suspicious connection attempt blocked from {ip}',
        'Potential SQL injection attack detected',
        'Multiple failed login attempts from {ip}',
        'Unusual outbound traffic pattern detected',
        'DDoS attack signature matched'
      ][Math.floor(Math.random() * 5)].replace('{ip}', `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`),
      source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      isInnocuous: Math.random() > 0.7
    }));
  },

  getSecurityServicesStatus: async (): Promise<SecurityServicesStatus> => {
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
      dns_filtering: "Licensed",
      geo_ip: "Licensed"
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
      source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      isInnocuous: Math.random() > 0.7,
      time: new Date().toISOString(),
      priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
      src_int_: 'X1',
      dst_int_: 'X2',
      src_ip: '192.168.1.1',
      src_port: 80,
      dst_ip: '192.168.1.2',
      dst_port: 443,
      ip_protocol: 'TCP',
      user_name: 'admin',
      application: 'web-browser',
      notes: 'Automated security event'
    }));

    const start = (page - 1) * pageSize;
    const paginatedLogs = mockLogs.slice(start, start + pageSize);

    return {
      logs: paginatedLogs,
      total: mockLogs.length
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
  },

  getIPSMetrics: async (): Promise<IPSMetrics> => {
    await new Promise(resolve => setTimeout(resolve, 700));

    return {
      total_attacks_blocked: 8934,
      totalDetections: 12500,
      blockedAttacks: 8934,
      attacks_by_category: [
        { category: 'SQL Injection', count: 2345, severity: 'Critical' },
        { category: 'Cross-Site Scripting', count: 1876, severity: 'High' },
        { category: 'Directory Traversal', count: 1234, severity: 'Medium' }
      ],
      topAttackers: [
        { ip: '192.168.1.100', count: 456 },
        { ip: '192.168.1.101', count: 234 },
        { ip: '192.168.1.102', count: 123 }
      ],
      top_attacked_services: [
        { service: 'HTTP', port: 80, count: 3456 },
        { service: 'HTTPS', port: 443, count: 2345 },
        { service: 'SSH', port: 22, count: 1234 }
      ],
      detectionsByType: [
        { type: 'Malware', count: 3456 },
        { type: 'Exploit', count: 2345 },
        { type: 'DoS', count: 1234 }
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
      activeSessions: 47,
      total_users: 89,
      totalBandwidth: 255.1,
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
      sessionsByType: [
        { type: 'Remote Access', count: 35 },
        { type: 'Site-to-Site', count: 12 }
      ],
      protocols: [
        { name: 'IPSec', sessions: 23 },
        { name: 'SSL VPN', sessions: 15 },
        { name: 'L2TP', sessions: 9 }
      ],
      topUsers: [
        { user: 'user1@company.com', bandwidth: 156.7 },
        { user: 'user2@company.com', bandwidth: 98.4 },
        { user: 'user3@company.com', bandwidth: 76.2 }
      ]
    };
  }
}; 