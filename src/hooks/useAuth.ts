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
      toast.error(error.response?.data?.message || 'Invalid username or password');
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

  return {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
    forgotPassword,
  };
};
