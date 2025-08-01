import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

interface DashboardStats {
  totalEmployees: number;
  compliantEmployees: number;
  pendingTraining: number;
  complianceScore: number;
  expiredCertificates: number;
  expiringCertificates: number;
}

interface RecentActivity {
  id: number;
  employeeName: string;
  training: string;
  status: string;
  date: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  employees: any[];
  certificates: any[];
  trainingSessions: any[];
}

export const useDashboardData = () => {
  const { user } = useAuth();
  
  return useQuery<DashboardData>({
    queryKey: ['dashboard-data', user?.id],
    queryFn: async () => {
      const token = sessionStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('/api/dashboard/data', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      return response.json();
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};