import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async (values) => {
    try {
      await authService.forgotPassword(values);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 size={26} />
        </div>
        <h1 className="font-display text-2xl font-extrabold text-white">Check your inbox</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          If an account exists with that email, we've sent a link to reset your password. It expires in 30 minutes.
        </p>
        <Link to="/login" className="btn-ghost mt-8 inline-flex">
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white">
        <ArrowLeft size={14} /> Back to login
      </Link>
      <p className="eyebrow mb-3">Reset Access</p>
      <h1 className="font-display text-3xl font-extrabold text-white">Forgot your password?</h1>
      <p className="mt-2 text-sm text-white/50">Enter your email and we'll send you a reset link.</p>

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

        <button type="submit" disabled={isSubmitting} className="btn-cta w-full disabled:opacity-60">
          <Mail size={16} /> {isSubmitting ? 'Sending link...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
