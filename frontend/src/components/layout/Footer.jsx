import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import logo from '../../assets/logo.jpeg';

const Footer = () => {
  return (
    <footer className="relative border-t border-white/[0.06] bg-black-soft/60 pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Xtreme Fitness" className="h-12 w-12 rounded-full object-cover" />
              <span className="font-display text-lg font-extrabold text-white">
                XTREME <span className="text-crimson-light">FITNESS</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Raichur's premium strength &amp; conditioning gym. Train with purpose, transform with a plan.
            </p>
            <div className="mt-5 flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-crimson-light hover:text-crimson-light"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-accent text-xs font-semibold uppercase tracking-wider text-white/40">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              <li><a href="/#about" className="hover:text-crimson-light">About Us</a></li>
              <li><a href="/#programs" className="hover:text-crimson-light">Programs</a></li>
              <li><a href="/#membership" className="hover:text-crimson-light">Membership</a></li>
              <li><a href="/#trainers" className="hover:text-crimson-light">Trainers</a></li>
              <li><a href="/#gallery" className="hover:text-crimson-light">Gallery</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-accent text-xs font-semibold uppercase tracking-wider text-white/40">Account</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              <li><Link to="/login" className="hover:text-crimson-light">Login</Link></li>
              <li><Link to="/register" className="hover:text-crimson-light">Register</Link></li>
              <li><Link to="/forgot-password" className="hover:text-crimson-light">Forgot Password</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-accent text-xs font-semibold uppercase tracking-wider text-white/40">Visit Us</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-crimson-light" />
                Station Road, Raichur, Karnataka 584101
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-crimson-light" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-crimson-light" />
                hello@xtremefitness.in
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] py-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Xtreme Fitness, Raichur. All rights reserved.</p>
          <p className="font-accent uppercase tracking-wider">Train. Transform. Dominate.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
