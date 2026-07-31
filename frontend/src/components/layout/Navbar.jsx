import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.jpeg';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/#about' },
  { label: 'Programs', to: '/#programs' },
  { label: 'Membership', to: '/#membership' },
  { label: 'Trainers', to: '/#trainers' },
  { label: 'Gallery', to: '/#gallery' },
  { label: 'Contact', to: '/#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, logout, homePathForRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.06] py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Xtreme Fitness" className="h-11 w-11 rounded-full object-cover ring-2 ring-crimson-light/30" />
          <span className="font-display text-lg font-extrabold tracking-tight text-white hidden sm:block">
            XTREME <span className="text-crimson-light">FITNESS</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="font-accent text-[13px] font-medium uppercase tracking-wide text-white/70 transition-colors hover:text-crimson-light"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="font-accent text-[13px] font-semibold uppercase tracking-wide text-white/80 hover:text-white">
                Login
              </Link>
              <Link to="/register" className="btn-cta !py-2.5 !px-6 text-xs">
                Join Now
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white transition hover:border-crimson-light/40"
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-crimson/30 text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="font-accent text-xs font-medium">{user.name.split(' ')[0]}</span>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="glass absolute right-0 mt-2 w-48 overflow-hidden p-2"
                  >
                    <Link
                      to={homePathForRole(user.role)}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-white/[0.06]"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <button className="lg:hidden text-white" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-black/95 backdrop-blur-xl border-t border-white/[0.06]"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 font-accent text-sm uppercase tracking-wide text-white/80"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 flex gap-3">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" className="btn-ghost flex-1 !py-2.5 text-xs" onClick={() => setMenuOpen(false)}>
                      Login
                    </Link>
                    <Link to="/register" className="btn-cta flex-1 !py-2.5 text-xs" onClick={() => setMenuOpen(false)}>
                      Join Now
                    </Link>
                  </>
                ) : (
                  <button onClick={handleLogout} className="btn-ghost flex-1 !py-2.5 text-xs">
                    Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
