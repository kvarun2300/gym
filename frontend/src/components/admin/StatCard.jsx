import React from 'react';

const StatCard = ({ icon: Icon, label, value, accent = 'crimson', suffix = '' }) => {
  const accentClasses = {
    crimson: 'bg-crimson/15 text-crimson-light',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
  };

  return (
    <div className="glass glass-hover p-6">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-5 font-display text-2xl font-extrabold text-white sm:text-3xl">
        {value}
        {suffix}
      </p>
      <p className="mt-1 font-accent text-xs uppercase tracking-wide text-white/45">{label}</p>
    </div>
  );
};

export default StatCard;
