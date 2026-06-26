import { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/types';
import { NotificationService } from '@/services/notification.service';
import { useAuthStore } from '@/store/auth.store';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  // Read token directly from store to avoid circular dependency (useAuth → useNotifications → useAuth)
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = !!token;

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await NotificationService.getAll();
      setNotifications(data);
    } catch (err) {
      // Silently fail — notification errors shouldn't disrupt the UI
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const count = await NotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      // Silently fail — don't show toast for background polling
      console.error('Failed to load unread count', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      // Reset state on logout
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    fetchUnreadCount();
    // Poll for unread count every 60 seconds
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount
  };
};
