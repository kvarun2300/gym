import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import RingStat from '../common/RingStat';

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-black pt-24">
      {/* Signature ring motif backdrop, echoing the dumbbell-in-ring logo mark */}
      <div className="absolute inset-0 bg-ring-glow" />
      <span className="ring-mark h-[640px] w-[640px] right-[-160px] top-1/2 -translate-y-1/2 animate-ring-spin-slow" />
      <span className="ring-mark h-[440px] w-[440px] right-[-60px] top-1/2 -translate-y-1/2" />
      <span className="ring-mark h-[240px] w-[240px] right-[40px] top-1/2 -translate-y-1/2" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-6"
          >
            Raichur, Karnataka — Est. Fitness Excellence
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl font-extrabold leading-[1.03] text-white sm:text-6xl lg:text-7xl"
          >
            TRAIN.
            <br />
            TRANSFORM.
            <br />
            <span className="text-gradient-crimson">DOMINATE.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-white/55"
          >
            Xtreme Fitness is Raichur's premium strength &amp; conditioning gym — expert trainers,
            data-backed programs, and a members-first culture built for people serious about results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link to="/register" className="btn-cta">
              Start Free Trial <ArrowRight size={16} />
            </Link>
            <a href="#programs" className="btn-ghost">
              <PlayCircle size={16} /> View Programs
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-14 flex flex-wrap gap-10"
          >
            <RingStat value={1200} suffix="+" label="Active Members" />
            <RingStat value={15} suffix="+" label="Expert Trainers" />
            <RingStat value={8} label="Years Running" />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
        <div className="h-9 w-5 rounded-full border border-white/20 p-1">
          <div className="h-1.5 w-1.5 rounded-full bg-crimson-light" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
