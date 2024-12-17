export interface SecurityServicesStatus {
  nodes_users: string;
  ssl_vpn_nodes_users: string;
  virtual_assist_nodes_users: string;
  vpn: string;
  global_vpn_client: string;
  cfs_content_filter_: string;
  expanded_feature_set: string;
  endpoint_security: string;
  gateway_anti_virus: string;
  capture_atp: string;
  anti_spyware: string;
  intrusion_prevention: string;
  app_control: string;
  app_visualization: string;
  anti_spam: string;
  analyzer: string;
  dpi_ssl: string;
  dpi_ssh: string;
  wan_acceleration: string;
  wxac_acceleration: string;
  botnet: string;
  dns_filtering: string;
}

export interface GatewayAntiVirusStatus {
  signature_database: string;
  signature_database_timestamp: string;
  last_checked: string;
  gateway_anti_virus_expiration_date: string;
}

export interface IntrusionPreventionStatus {
  signature_database: string;
  signature_database_timestamp: string;
  last_checked: string;
  ips_service_expiration_date: string;
}

export interface BotnetStatus {
  botnet_database: string;
  message: string;
}

export interface ContentFilteringCategory {
  id: number;
  name: string;
  status: string;
  hits_today: number;
}

export interface ContentFilteringStatus {
  database_version: string;
  last_updated: string;
  expiration_date: string;
  total_requests_today: number;
  total_blocked_today: number;
  categories: ContentFilteringCategory[];
}

export interface AntiSpywareStatus {
  signature_database: string;
  signature_database_timestamp: string;
  last_checked: string;
  anti_spyware_expiration_date: string;
  active_signatures: number;
  blocked_today: number;
}

export interface SecurityLog {
  time: string;
  id: number;
  category: string;
  priority: 'Alert' | 'Notice' | 'Information';
  src_int_: string | null;
  dst_int_: string | null;
  src_ip: string;
  src_port: number;
  dst_ip: string;
  dst_port: number;
  ip_protocol: string | null;
  user_name: string | null;
  application: string | null;
  notes: string;
  message: string;
}

export interface LogsResponse {
  logs: SecurityLog[];
  total: number;
}

export interface LogFilter {
  startTime?: string;
  endTime?: string;
  category?: string;
  priority?: string;
  searchTerm?: string;
}

export interface ThreatMetrics {
  total_threats_blocked: number;
  threats_by_type: {
    malware: number;
    ransomware: number;
    phishing: number;
    ddos: number;
    botnet: number;
    other: number;
  };
  threats_by_severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  geographic_data: {
    country: string;
    count: number;
    latitude: number;
    longitude: number;
  }[];
  trend_data: {
    timestamp: string;
    count: number;
  }[];
}

export interface IPSMetrics {
  total_attacks_blocked: number;
  attacks_by_category: {
    category: string;
    count: number;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
  }[];
  top_attacked_services: {
    service: string;
    port: number;
    count: number;
  }[];
  signature_coverage: {
    total_signatures: number;
    active_signatures: number;
    custom_signatures: number;
  };
  performance_impact: {
    latency_ms: number;
    packets_analyzed: number;
    packets_dropped: number;
  };
}

export interface VPNMetrics {
  active_sessions: number;
  total_users: number;
  bandwidth_usage: {
    incoming_mbps: number;
    outgoing_mbps: number;
  };
  session_data: {
    user: string;
    ip_address: string;
    duration: number;
    bytes_transferred: number;
    last_activity: string;
  }[];
  protocols: {
    name: string;
    sessions: number;
  }[];
}

export interface SystemPerformance {
  cpu_usage: number;
  memory_usage: {
    total_mb: number;
    used_mb: number;
    free_mb: number;
  };
  network_throughput: {
    timestamp: string;
    incoming_mbps: number;
    outgoing_mbps: number;
  }[];
  interface_stats: {
    name: string;
    status: 'Up' | 'Down';
    packets_in: number;
    packets_out: number;
    errors_in: number;
    errors_out: number;
  }[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  message: string;
  source: string;
  isInnocuous?: boolean;
  aiAnalysis?: string;
}

export interface SecurityMetrics {
  totalThreats: number;
  blockedAttacks: number;
  activeConnections: number;
  bandwidthUsage: number;
}

export interface LogFilter {
  severity?: 'high' | 'medium' | 'low';
  category?: string;
  source?: string;
  searchTerm?: string;
  showInnocuous?: boolean;
}

export interface IPSMetrics {
  totalDetections: number;
  blockedAttacks: number;
  topAttackers: Array<{ ip: string; count: number }>;
  detectionsByType: Array<{ type: string; count: number }>;
}

export interface VPNMetrics {
  activeSessions: number;
  totalBandwidth: number;
  sessionsByType: Array<{ type: string; count: number }>;
  topUsers: Array<{ user: string; bandwidth: number }>;
}

export interface SystemPerformance {
  cpu_usage: number;
  memory_usage: {
    total_mb: number;
    used_mb: number;
    free_mb: number;
  };
  network_throughput: Array<{
    timestamp: string;
    incoming_mbps: number;
    outgoing_mbps: number;
  }>;
  interface_stats: Array<{
    name: string;
    status: string;
    packets_in: number;
    packets_out: number;
    errors_in: number;
    errors_out: number;
  }>;
} 