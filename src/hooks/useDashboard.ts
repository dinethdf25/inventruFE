import { useState, useEffect, useCallback } from 'react';
import { DashboardStats } from '@/types';
import { DashboardService } from '@/services/dashboard.service';
import { BatchService } from '@/services/batch.service';
import { ReorderService } from '@/services/reorder.service';
import toast from 'react-hot-toast';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyAnalytics, setMonthlyAnalytics] = useState<any[]>([]);
  const [extraStats, setExtraStats] = useState({ totalBatches: 0, expiringBatches: 0, pendingReorders: 0 });
  const [expiringBatches, setExpiringBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewData, analyticsData, bCount, expCount, reorderCount, expBatches] = await Promise.all([
        DashboardService.getOverview(),
        DashboardService.getMonthlyAnalytics(),
        BatchService.getCount().catch(() => 0),
        BatchService.getExpiringCount().catch(() => 0),
        ReorderService.getPendingCount().catch(() => 0),
        BatchService.getExpiringSoon(7).catch(() => [])
      ]);
      setStats(overviewData);
      setMonthlyAnalytics(analyticsData);
      setExtraStats({ totalBatches: bCount as number, expiringBatches: expCount as number, pendingReorders: reorderCount as number });
      setExpiringBatches(expBatches as any[]);
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
    extraStats,
    expiringBatches,
    loading,
    error,
    refetch: fetchDashboardData
  };
};
