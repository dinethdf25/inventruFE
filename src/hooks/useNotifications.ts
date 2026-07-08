import { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/types';
import { NotificationService } from '@/services/notification.service';
import { useAuthStore } from '@/store/auth.store';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!token;
  const role = user?.role || '';

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !role) return;
    setLoading(true);
    try {
      const data = await NotificationService.getByRole(role);
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, role]);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !role) return;
    try {
      const count = await NotificationService.getUnreadCount(role);
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load unread count', err);
    }
  }, [isAuthenticated, role]);

  const markAsRead = async (id: number | string) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !role) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, role, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead
  };
};
