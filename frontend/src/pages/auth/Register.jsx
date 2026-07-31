import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, homePathForRole } = useAuth();
  const navigate = useNavigate();
  const password = watch('password');

  const onSubmit = async (values) => {
    try {
      const { confirmPassword, ...payload } = values;
      const user = await registerUser(payload);
      navigate(homePathForRole(user.role), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <p className="eyebrow mb-3">Join The Team</p>
      <h1 className="font-display text-3xl font-extrabold text-white">Create your account</h1>
      <p className="mt-2 text-sm text-white/50">
        Already a member?{' '}
        <Link to="/login" className="font-medium text-crimson-light hover:underline">
          Log in
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-5">
        <div>
          <label className="label-field">Full Name</label>
          <input className="input-field" placeholder="Your full name" {...register('name', { required: 'Name is required' })} />
          {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label-field">Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' } })}
          />
          {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label-field">Phone</label>
          <input className="input-field" placeholder="+91 98765 43210" {...register('phone')} />
        </div>

        <div>
          <label className="label-field">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field pr-11"
              placeholder="At least 6 characters"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
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

        <div>
          <label className="label-field">Confirm Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="input-field"
            placeholder="Re-enter password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (v) => v === password || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-danger">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-cta w-full disabled:opacity-60">
          <UserPlus size={16} /> {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-white/30">
          By signing up you agree to Xtreme Fitness's terms of service and gym policies.
        </p>
      </form>
    </div>
  );
};

export default Register;
