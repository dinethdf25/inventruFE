import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';
import { User, Lock, Leaf } from 'lucide-react';
import { APP_CONFIG } from '@/constants/app.constants';

export const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, skip the login page and go straight to dashboard
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
    return null;
  }

  const onSubmit = async (data: any) => {
    const success = await login(data);
    if (success) {
      // Go back to the page the user originally tried to visit
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      {/* Background split (teal top, gray bottom) */}
      <div className="absolute inset-0 z-0 flex flex-col">
        <div className="h-[45%] bg-primary"></div>
        <div className="h-[55%] bg-surface"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-card rounded-2xl shadow-xl border border-border">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary mb-4">
            <Leaf size={32} />
          </div>
          <h1 className="text-2xl font-bold text-text">{APP_CONFIG.APP_NAME}</h1>
          <p className="text-muted mt-2">Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Username"
            icon={<User size={18} />}
            placeholder="Enter your username"
            {...register('username', { required: 'Username is required' })}
            error={errors.username?.message as string}
          />

          <Input
            label="Password"
            type="password"
            icon={<Lock size={18} />}
            placeholder="Enter your password"
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message as string}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
          >
            Sign in
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm flex flex-col gap-2">
          <Link to="/forgot-password" className="text-primary hover:underline font-medium">Forgot your password?</Link>
          <p className="text-muted">Secure Access Only. Use authorized credentials.</p>
        </div>
      </div>
    </div>
  );
};
