import React, { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, animate } from 'framer-motion';

/**
 * A stat chip framed by a completing ring (echoes the dumbbell-in-ring logo mark).
 * The ring fills as the number counts up, then holds solid — used across the site
 * for member counts, years active, trainer counts, etc.
 */
const RingStat = ({ value, label, suffix = '', duration = 1.8 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);
  const [dash, setDash] = useState(0);
  const circumference = 2 * Math.PI * 26;

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        setDisplay(Math.round(v));
        setDash((v / value) * circumference);
      },
    });
    return () => controls.stop();
  }, [isInView, value, duration, circumference]);

  return (
    <div ref={ref} className="flex items-center gap-4">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90 shrink-0">
        <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none" />
        <circle
          cx="32"
          cy="32"
          r="26"
          stroke="#E63946"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
        />
      </svg>
      <div>
        <p className="font-display text-2xl font-extrabold text-white leading-none">
          {display}
          {suffix}
        </p>
        <p className="mt-1 font-accent text-[11px] uppercase tracking-wider text-white/50">{label}</p>
      </div>
    </div>
  );
};

export default RingStat;
