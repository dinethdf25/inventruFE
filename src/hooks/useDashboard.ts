import { useState, useEffect, useCallback } from 'react';
import { DashboardStats } from '@/types';
import { DashboardService } from '@/services/dashboard.service';
import toast from 'react-hot-toast';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyAnalytics, setMonthlyAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewData, analyticsData] = await Promise.all([
        DashboardService.getOverview(),
        DashboardService.getMonthlyAnalytics()
      ]);
      setStats(overviewData);
      setMonthlyAnalytics(analyticsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to connect to backend for dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    monthlyAnalytics,
    loading,
    error,
    refetch: fetchDashboardData
  };
};
