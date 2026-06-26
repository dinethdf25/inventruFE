import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { AppShell } from '@/components/layout';

import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ProductsPage } from '@/pages/products/ProductsPage';
import { BatchesPage } from '@/pages/batches/BatchesPage';
import { InventoryPage } from '@/pages/inventory/InventoryPage';
import { AlertsPage } from '@/pages/alerts/AlertsPage';
import { SuppliersPage } from '@/pages/suppliers/SuppliersPage';
import { LocationsPage } from '@/pages/locations/LocationsPage';

// No placeholders remaining

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell><DashboardPage /></AppShell>} path="/dashboard" />
        <Route element={<AppShell><ProductsPage /></AppShell>} path="/products" />
        <Route element={<AppShell><SuppliersPage /></AppShell>} path="/suppliers" />
        <Route element={<AppShell><LocationsPage /></AppShell>} path="/locations" />
        <Route element={<AppShell><BatchesPage /></AppShell>} path="/batches" />
        <Route element={<AppShell><InventoryPage /></AppShell>} path="/inventory" />
        <Route element={<AppShell><AlertsPage /></AppShell>} path="/alerts" />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Fallback: redirect unknown routes to login — ProtectedRoute will forward authenticated users to dashboard */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
