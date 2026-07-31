import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.jpeg';

const AuthLayout = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-black lg:grid-cols-2">
      {/* Branding panel */}
      <div className="relative hidden overflow-hidden bg-black-soft lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-ring-glow" />
        <span className="ring-mark h-[520px] w-[520px] -left-40 -top-40 animate-ring-spin-slow" />
        <span className="ring-mark h-[360px] w-[360px] right-[-120px] bottom-[-120px]" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="Xtreme Fitness" className="h-12 w-12 rounded-full object-cover" />
          <span className="font-display text-xl font-extrabold text-white">
            XTREME <span className="text-crimson-light">FITNESS</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-md"
        >
          <p className="eyebrow mb-4">Raichur · Karnataka</p>
          <h2 className="font-display text-4xl font-extrabold leading-tight text-white">
            Discipline builds the body.
            <br />
            <span className="text-crimson-light">Community keeps it going.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            Join a gym that tracks your progress, plans your training, and holds you accountable —
            every rep of the way.
          </p>
        </motion.div>

        <p className="relative z-10 font-accent text-xs uppercase tracking-wider text-white/30">
          Train. Transform. Dominate.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <Link to="/" className="mb-10 flex items-center gap-3 lg:hidden">
          <img src={logo} alt="Xtreme Fitness" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-display text-lg font-extrabold text-white">
            XTREME <span className="text-crimson-light">FITNESS</span>
          </span>
        </Link>
        <div className="mx-auto w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
