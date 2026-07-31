import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { login, homePathForRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (values) => {
    try {
      const user = await login(values);
      const redirectTo = location.state?.from?.pathname || homePathForRole(user.role);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div>
      <p className="eyebrow mb-3">Welcome Back</p>
      <h1 className="font-display text-3xl font-extrabold text-white">Log in to your account</h1>
      <p className="mt-2 text-sm text-white/50">
        New here?{' '}
        <Link to="/register" className="font-medium text-crimson-light hover:underline">
          Create an account
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-5">
        <div>
          <label className="label-field">Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="label-field !mb-0">Password</label>
            <Link to="/forgot-password" className="mb-2 text-xs text-white/40 hover:text-crimson-light">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field pr-11"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-danger">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-cta w-full disabled:opacity-60">
          <LogIn size={16} /> {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
