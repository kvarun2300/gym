import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CreditCard,
  CalendarCheck,
  Wallet,
  FileText,
  BarChart3,
  Megaphone,
  Settings,
  X,
} from 'lucide-react';
import logo from '../../assets/logo.jpeg';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { to: '/admin/members', label: 'Members', icon: Users, active: true },
  { to: '/admin/trainers', label: 'Trainers', icon: Dumbbell, active: true },
  { to: '/admin/plans', label: 'Membership Plans', icon: CreditCard, active: true },
  { to: '/admin/attendance', label: 'Attendance', icon: CalendarCheck, active: false },
  { to: '/admin/payments', label: 'Payments', icon: Wallet, active: false },
  { to: '/admin/invoices', label: 'Invoices', icon: FileText, active: false },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3, active: false },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone, active: false },
  { to: '/admin/settings', label: 'Settings', icon: Settings, active: false },
];

const NavItem = ({ item, onClick }) => {
  if (!item.active) {
    return (
      <div className="flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-white/25">
        <item.icon size={18} />
        <span className="font-accent text-sm">{item.label}</span>
        <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/30">
          Soon
        </span>
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center gap-3 rounded-xl px-4 py-3 font-accent text-sm transition-colors ${
          isActive ? 'bg-crimson/15 text-white' : 'text-white/55 hover:bg-white/[0.05] hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="admin-nav-active"
              className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-crimson-light"
            />
          )}
          <item.icon size={18} className={isActive ? 'text-crimson-light' : ''} />
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  );
};

const SidebarContent = ({ onNavigate }) => (
  <div className="flex h-full flex-col">
    <div className="flex items-center gap-3 px-5 py-6">
      <img src={logo} alt="Xtreme Fitness" className="h-10 w-10 rounded-full object-cover" />
      <div>
        <p className="font-display text-sm font-extrabold leading-none text-white">XTREME FITNESS</p>
        <p className="mt-1 font-accent text-[10px] uppercase tracking-wider text-crimson-light">Admin Panel</p>
      </div>
    </div>
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.label} item={item} onClick={onNavigate} />
      ))}
    </nav>
    <div className="px-5 py-5">
      <div className="glass p-4 text-center">
        <p className="font-accent text-[11px] uppercase tracking-wider text-white/40">Raichur, Karnataka</p>
        <p className="mt-1 font-display text-xs font-bold text-crimson-light">Train. Transform. Dominate.</p>
      </div>
    </div>
  </div>
);

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-72 shrink-0 border-r border-white/[0.06] bg-black-soft/60 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-black-soft lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-5 text-white/50 hover:text-white"
              >
                <X size={20} />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
