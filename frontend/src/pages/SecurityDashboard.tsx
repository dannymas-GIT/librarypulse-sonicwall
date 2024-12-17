import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, AlertTriangle, Activity } from 'lucide-react';
import { mockSecurityService } from '../services/mockSecurityService';
import { SecurityStatusCard } from '../components/security/SecurityStatusCard';
import { ContentFilteringChart } from '../components/security/ContentFilteringChart';
import { ServiceExpirationCard } from '../components/security/ServiceExpirationCard';
import { SecurityMetricsGrid } from '../components/security/SecurityMetricsGrid';
import { SecurityLogTable } from '../components/security/SecurityLogTable';

export const SecurityDashboard: React.FC = () => {
  const { data: servicesStatus, isLoading: isLoadingServices } = useQuery({
    queryKey: ['securityServices'],
    queryFn: mockSecurityService.getSecurityServicesStatus
  });

  const { data: contentFiltering, isLoading: isLoadingContent } = useQuery({
    queryKey: ['contentFiltering'],
    queryFn: mockSecurityService.getContentFilteringStatus
  });

  const { data: antiSpyware, isLoading: isLoadingSpyware } = useQuery({
    queryKey: ['antiSpyware'],
    queryFn: mockSecurityService.getAntiSpywareStatus
  });

  const isLoading = isLoadingServices || isLoadingContent || isLoadingSpyware;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Security Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SecurityStatusCard
          title="Security Services"
          icon={<Shield className="w-6 h-6" />}
          status={servicesStatus?.gateway_anti_virus === "Licensed" ? "Active" : "Inactive"}
          details={`${Object.values(servicesStatus || {}).filter(v => v.includes("Licensed")).length} services active`}
        />
        
        <SecurityStatusCard
          title="Threats Blocked Today"
          icon={<AlertTriangle className="w-6 h-6" />}
          status="Warning"
          details={`${antiSpyware?.blocked_today || 0} threats detected and blocked`}
        />
        
        <SecurityStatusCard
          title="Content Filtering"
          icon={<Activity className="w-6 h-6" />}
          status="Active"
          details={`${contentFiltering?.total_blocked_today || 0} requests blocked today`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ContentFilteringChart data={contentFiltering?.categories || []} />
        <SecurityMetricsGrid />
      </div>

      <div className="mt-8">
        <ServiceExpirationCard />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Security Logs</h2>
        <SecurityLogTable />
      </div>
    </div>
  );
}; 