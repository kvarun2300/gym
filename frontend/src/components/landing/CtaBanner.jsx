import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../common/ScrollReveal';

const CtaBanner = () => {
  return (
    <section className="relative overflow-hidden bg-black py-24">
      <div className="absolute inset-0 bg-ring-glow" />
      <span className="ring-mark h-[420px] w-[420px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal>
          <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
            Your transformation starts <span className="text-crimson-light">today</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/50">
            First session is on us. Walk in, meet the team, and see the floor for yourself.
          </p>
          <Link to="/register" className="btn-cta mt-8 inline-flex">
            Claim Your Free Trial <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CtaBanner;
