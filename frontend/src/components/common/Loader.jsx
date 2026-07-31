import React from 'react';
import logo from '../../assets/logo.jpeg';

const Loader = ({ fullScreen = false, label = 'Loading' }) => {
  const wrapperClass = fullScreen
    ? 'fixed inset-0 z-[999] flex items-center justify-center bg-black'
    : 'flex items-center justify-center py-16';

  return (
    <div className={wrapperClass}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-20 w-20">
          <span className="absolute inset-0 rounded-full border-2 border-crimson-light/20" />
          <span className="absolute inset-0 rounded-full border-2 border-t-crimson-light border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <img
            src={logo}
            alt="Xtreme Fitness"
            className="absolute inset-0 m-auto h-12 w-12 rounded-full object-cover"
          />
        </div>
        <p className="font-accent text-xs uppercase tracking-[0.3em] text-white/50">{label}</p>
      </div>
    </div>
  );
};

export default Loader;
