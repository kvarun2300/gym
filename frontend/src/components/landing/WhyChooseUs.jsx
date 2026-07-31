import React from 'react';
import { Dumbbell, HeartPulse, Users, Trophy } from 'lucide-react';
import ScrollReveal from '../common/ScrollReveal';

const REASONS = [
  {
    icon: Dumbbell,
    title: 'Elite Equipment',
    desc: 'Commercial-grade strength and cardio machines, maintained to competition standard.',
  },
  {
    icon: Users,
    title: 'Certified Trainers',
    desc: 'Every coach is certified and specializes in strength, conditioning, or rehab.',
  },
  {
    icon: HeartPulse,
    title: 'Tracked Progress',
    desc: 'BMI, body composition, and attendance tracked so your plan adapts to real data.',
  },
  {
    icon: Trophy,
    title: 'Proven Results',
    desc: 'Hundreds of transformation stories from members across Raichur.',
  },
];

const WhyChooseUs = () => {
  return (
    <section id="about" className="relative bg-black py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal className="mb-14 max-w-xl">
          <p className="eyebrow mb-4">Why Xtreme Fitness</p>
          <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
            Built different, <span className="text-crimson-light">built for results</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 0.08}>
              <div className="glass glass-hover h-full p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-crimson/15 text-crimson-light">
                  <r.icon size={22} />
                </div>
                <h3 className="font-display text-lg font-bold text-white">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{r.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
