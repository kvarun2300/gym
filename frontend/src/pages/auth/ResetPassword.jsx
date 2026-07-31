import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '../../services/authService';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const [done, setDone] = useState(false);
  const password = watch('password');

  const onSubmit = async (values) => {
    try {
      await authService.resetPassword(token, { password: values.password });
      setDone(true);
      toast.success('Password reset! Please log in.');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      toast.error(err.response?.data?.message || 'This reset link is invalid or has expired.');
    }
  };

  return (
    <div>
      <p className="eyebrow mb-3">Set New Password</p>
      <h1 className="font-display text-3xl font-extrabold text-white">Reset your password</h1>
      <p className="mt-2 text-sm text-white/50">Choose a new password for your account.</p>

      {done ? (
        <p className="mt-8 text-sm text-success">Password updated — redirecting you to login...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-9 space-y-5">
          <div>
            <label className="label-field">New Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="At least 6 characters"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
            />
            {errors.password && <p className="mt-1.5 text-xs text-danger">{errors.password.message}</p>}
          </div>
          <div>
            <label className="label-field">Confirm New Password</label>
            <input
              type="password"
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
            <KeyRound size={16} /> {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-xs text-white/30">
        <Link to="/login" className="hover:text-crimson-light">Back to login</Link>
      </p>
    </div>
  );
};

export default ResetPassword;
