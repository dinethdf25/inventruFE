import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

export const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    // Redirect to login if unauthenticated, save the intended location so
    // the user is sent back there after successfully logging in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
