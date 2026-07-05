import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { AuthService } from '@/services/auth.service';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  // Get state and actions from the store using selectors
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const storeLogin = useAuthStore((state) => state.login);
  const storeLogout = useAuthStore((state) => state.logout);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      console.log('Attempting login with credentials:', credentials);
      const { token: newToken, user: newUser } = await AuthService.login(credentials);

      console.log('Login successful! Extracted Token:', newToken ? 'YES' : 'NO', 'User:', newUser);

      if (!newToken) {
        throw new Error('Authentication failed: No token received');
      }
      storeLogin(newToken, newUser);
      toast.success('Successfully logged in');
      return true;
    } catch (error: any) {
      console.error('Login Error Caught in useAuth:', error);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
      }
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message == "User not found" && "Please enter valid username or password" || 'Invalid username or password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
    } catch (e) {
      // ignore
    } finally {
      storeLogout();
      setLoading(false);
      window.location.href = '/login';
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      await AuthService.forgotPassword({ email });
      toast.success('Password reset link sent to your email');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isModuleVisible = (moduleName: string): boolean => {
    if (!user) return false;
    const role = user.role?.toUpperCase();
    if (role === 'ADMIN' || role === 'SUPER ADMIN' || role === 'SUPERADMIN') return true;

    // Check user's specific permissions array
    if (user.permissions && Array.isArray(user.permissions)) {
      if (moduleName === 'Suppliers' && user.permissions.includes('SUPPLIER_READ')) return true;
      if (moduleName === 'Products' && user.permissions.includes('PRODUCT_READ')) return true;
      if (moduleName === 'Batches' && user.permissions.includes('BATCH_READ')) return true;
      if (moduleName === 'Locations' && user.permissions.includes('LOCATION_READ')) return true;
      if (moduleName === 'Alerts' && user.permissions.includes('ALERT_VIEW')) return true;
      if (moduleName === 'User Management' && user.permissions.includes('USER_READ')) return true;
    }

    // Role based module mapping
    const roleModules: Record<string, string[]> = {
      MANAGER: ['Dashboard', 'Products', 'Suppliers', 'User Management', 'Reorders'],
      STAFF: ['Dashboard', 'Products', 'Batches', 'Inventory', 'QR Codes', 'Alerts', 'Suppliers']
    };

    return roleModules[role]?.includes(moduleName) || false;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const role = user.role?.toUpperCase();
    if (role === 'ADMIN' || role === 'SUPER ADMIN' || role === 'SUPERADMIN') return true;

    // Check user's specific permissions array first
    if (user.permissions && Array.isArray(user.permissions)) {
      if (user.permissions.includes(permission)) return true;

      // Group/friendly permission mappings
      if (permission === 'Supplier CRUD') {
        const crudPerms = ['SUPPLIER_CREATE', 'SUPPLIER_UPDATE', 'SUPPLIER_DELETE'];
        if (crudPerms.some(p => user.permissions.includes(p))) return true;
      }
      if (permission === 'Product CRUD') {
        const crudPerms = ['PRODUCT_CREATE', 'PRODUCT_UPDATE', 'PRODUCT_DELETE'];
        if (crudPerms.some(p => user.permissions.includes(p))) return true;
      }
      if (permission === 'Batch CRUD') {
        const crudPerms = ['BATCH_CREATE', 'BATCH_UPDATE', 'BATCH_DELETE'];
        if (crudPerms.some(p => user.permissions.includes(p))) return true;
      }
      if (permission === 'Supplier Read' && user.permissions.includes('SUPPLIER_READ')) return true;
      if (permission === 'Product Read' && user.permissions.includes('PRODUCT_READ')) return true;
      if (permission === 'Batch Read' && user.permissions.includes('BATCH_READ')) return true;
      if (permission === 'Inventory Read' && user.permissions.includes('LOCATION_READ')) return true;
      if (permission === 'Inventory Adjust' && (user.permissions.includes('LOCATION_ASSIGN_BATCH') || user.permissions.includes('LOCATION_MOVE_BATCH'))) return true;
      if (permission === 'Alert Read' && user.permissions.includes('ALERT_VIEW')) return true;
      if (permission === 'Alert Resolve' && user.permissions.includes('ALERT_RESOLVE')) return true;
    }

    // Role based permission mapping fallback
    const rolePermissions: Record<string, string[]> = {
      MANAGER: ['Product CRUD', 'Supplier CRUD', 'Product Read', 'Supplier Read', 'Reorder Read', 'Reorder CRUD'],
      STAFF: ['Product Read', 'Batch Read', 'Inventory Read', 'Inventory Adjust', 'Alert Read', 'Alert Resolve', 'Supplier Read', 'Supplier CRUD']
    };

    return rolePermissions[role]?.includes(permission) || false;
  };

  return {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
    forgotPassword,
    isModuleVisible,
    hasPermission,
  };
};
