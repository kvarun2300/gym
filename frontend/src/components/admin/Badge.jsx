import React from 'react';

const VARIANTS = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  neutral: 'bg-white/10 text-white/60',
  crimson: 'bg-crimson/15 text-crimson-light',
};

const Badge = ({ children, variant = 'neutral' }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-accent text-[11px] font-semibold uppercase tracking-wide ${VARIANTS[variant]}`}>
    {children}
  </span>
);

export default Badge;
