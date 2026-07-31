import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ title, onMenuClick }) => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-black/70 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="text-white/70 hover:text-white lg:hidden">
          <Menu size={22} />
        </button>
        <h1 className="font-display text-lg font-extrabold text-white sm:text-xl">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 hover:border-crimson-light hover:text-crimson-light">
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-crimson-light" />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-3 hover:border-crimson-light/40"
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-crimson/30 text-xs font-bold text-white">
                {user?.name?.charAt(0)}
              </div>
            )}
            <span className="hidden font-accent text-xs font-medium text-white sm:block">{user?.name}</span>
            <ChevronDown size={14} className="text-white/40" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="glass absolute right-0 mt-2 w-44 overflow-hidden p-2"
              >
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/80 hover:bg-white/[0.06]">
                  <User size={15} /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-white/[0.06]"
                >
                  <LogOut size={15} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
