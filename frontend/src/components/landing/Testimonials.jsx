import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../common/ScrollReveal';

const TESTIMONIALS = [
  {
    name: 'Priya Deshmukh',
    result: 'Lost 14kg in 6 months',
    quote:
      'The trainers actually track your progress week to week. I have never stuck with a gym this long before Xtreme.',
  },
  {
    name: 'Rahul Iyer',
    result: 'Gained 8kg lean muscle',
    quote:
      'Structured programming and a coach who checks my form every session. This is the most serious gym in Raichur.',
  },
  {
    name: 'Sneha Kulkarni',
    result: 'First 5K to first marathon',
    quote:
      'From barely running a kilometre to finishing a half marathon — the conditioning program here changed what I thought was possible.',
  },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const active = TESTIMONIALS[index];

  const go = (dir) => setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="relative bg-black py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal>
          <p className="eyebrow mb-4 justify-center">Success Stories</p>
          <h2 className="mb-14 font-display text-4xl font-extrabold text-white sm:text-5xl">
            Words from our <span className="text-crimson-light">members</span>
          </h2>
        </ScrollReveal>

        <div className="glass relative overflow-hidden p-10 sm:p-14">
          <Quote className="mx-auto mb-6 text-crimson-light/40" size={36} />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-lg leading-relaxed text-white/80 sm:text-xl">"{active.quote}"</p>
              <p className="mt-6 font-display text-base font-bold text-white">{active.name}</p>
              <p className="font-accent text-xs uppercase tracking-wider text-crimson-light">{active.result}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => go(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-crimson-light hover:text-crimson-light"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-crimson-light' : 'w-1.5 bg-white/20'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-crimson-light hover:text-crimson-light"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
