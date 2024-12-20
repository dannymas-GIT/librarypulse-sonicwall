export interface SecurityLog {
  id: string;
  timestamp: string;
  severity: string;
  category: string;
  message: string;
  source: string;
}

export interface LogsResponse {
  logs: SecurityLog[];
  total: number;
}

export interface SecurityLogTableProps {
  logs: SecurityLog[];
  onUpdateLog?: (logId: string, updates: Partial<SecurityLog>) => void;
  onAnalyzeLogs?: (logs: SecurityLog[]) => Promise<void>;
}

export interface ThreatMetrics {
  total_threats_blocked: number;
  threats_by_type: Record<string, number>;
  threats_by_severity: Record<string, number>;
  geographic_data: Array<{
    country: string;
    count: number;
    latitude: number;
    longitude: number;
  }>;
  trend_data: Array<{
    timestamp: string;
    count: number;
  }>;
}

export interface IPSMetrics {
  total_attacks_blocked: number;
  totalDetections?: number;
  blockedAttacks?: number;
  attacks_by_category: Array<{
    category: string;
    count: number;
    severity: string;
  }>;
  topAttackers?: Array<{
    ip: string;
    count: number;
  }>;
  top_attacked_services: Array<{
    service: string;
    port: number;
    count: number;
  }>;
  detectionsByType?: Array<{
    type: string;
    count: number;
  }>;
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
  activeSessions?: number;
  total_users: number;
  totalBandwidth?: number;
  bandwidth_usage: {
    incoming_mbps: number;
    outgoing_mbps: number;
  };
  session_data: Array<{
    user: string;
    ip_address: string;
    duration: number;
    bytes_transferred: number;
    last_activity: string;
  }>;
  sessionsByType?: Array<{
    type: string;
    count: number;
  }>;
  protocols: Array<{
    name: string;
    sessions: number;
  }>;
  topUsers?: Array<{
    user: string;
    bandwidth: number;
  }>;
}

export interface ChatAssistantProps {
  selectedLogs: SecurityLog[];
  onMarkInnocuous?: (logId: string) => void;
}

export interface ThreatMetricsPanelProps {
  data?: Partial<ThreatMetrics>;
}

export interface ThreatMapProps {
  data?: Array<{
    country: string;
    count: number;
    latitude: number;
    longitude: number;
  }>;
}

export interface SecurityServicesStatus {
  gateway_anti_virus: string;
  intrusion_prevention: string;
  anti_spyware: string;
  geo_ip: string;
  botnet: string;
  [key: string]: string;
}

export interface ContentFilteringStatus {
  database_version: string;
  last_updated: string;
  expiration_date: string;
  total_requests_today: number;
  total_blocked_today: number;
  categories: Array<{
    id: number;
    name: string;
    status: string;
    hits_today: number;
  }>;
}

export interface AntiSpywareStatus {
  signature_database: string;
  signature_database_timestamp: string;
  last_checked: string;
  anti_spyware_expiration_date: string;
  active_signatures: number;
  blocked_today: number;
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
    status: "Up" | "Down";
    packets_in: number;
    packets_out: number;
    errors_in: number;
    errors_out: number;
  }>;
}

export type MockData<T> = Partial<T>; 