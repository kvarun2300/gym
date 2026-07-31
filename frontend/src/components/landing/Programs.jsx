import React from 'react';
import { Flame, Zap, Shield, Activity, Bike, PersonStanding } from 'lucide-react';
import ScrollReveal from '../common/ScrollReveal';

const PROGRAMS = [
  { icon: Flame, name: 'Strength & Powerlifting', desc: 'Build raw, functional strength with progressive overload programming.' },
  { icon: Zap, name: 'HIIT & Conditioning', desc: 'High-intensity circuits engineered to torch fat and build endurance.' },
  { icon: Shield, name: 'CrossFit Style Training', desc: 'Varied, high-intensity functional movements for total athleticism.' },
  { icon: Activity, name: 'Bodybuilding', desc: 'Hypertrophy-focused splits for serious, measurable muscle growth.' },
  { icon: PersonStanding, name: 'Yoga & Mobility', desc: 'Improve flexibility, recovery, and mind-body control.' },
  { icon: Bike, name: 'Cardio & Endurance', desc: 'Structured cardio protocols to build stamina and heart health.' },
];

const Programs = () => {
  return (
    <section id="programs" className="relative bg-black-soft/40 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-4">Workout Categories</p>
            <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
              Programs for every <span className="text-crimson-light">goal</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/50">
            Whether you're chasing a PR, a physique, or just a healthier week — there's a coached
            program built for it.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p, i) => (
            <ScrollReveal key={p.name} delay={i * 0.06}>
              <div className="glass glass-hover group h-full p-7">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-crimson/15 text-crimson-light transition-colors group-hover:bg-crimson-light group-hover:text-white">
                    <p.icon size={22} />
                  </div>
                  <span className="font-accent text-[11px] font-semibold uppercase tracking-widest text-white/25">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-lg font-bold text-white">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{p.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
