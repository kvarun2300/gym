import React from 'react';
import { Waves, ParkingCircle, Wifi, ShowerHead, Apple, Salad } from 'lucide-react';
import ScrollReveal from '../common/ScrollReveal';

const FACILITIES = [
  { icon: Waves, label: 'Recovery Zone' },
  { icon: ShowerHead, label: 'Locker & Showers' },
  { icon: ParkingCircle, label: 'Free Parking' },
  { icon: Wifi, label: 'Free Wi-Fi' },
];

const FacilitiesNutrition = () => {
  return (
    <section className="relative bg-black-soft/40 py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2">
        <ScrollReveal>
          <p className="eyebrow mb-4">Our Facilities</p>
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Everything you need, <span className="text-crimson-light">under one roof</span>
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {FACILITIES.map((f) => (
              <div key={f.label} className="glass glass-hover flex items-center gap-3 p-5">
                <f.icon size={20} className="shrink-0 text-crimson-light" />
                <span className="text-sm font-medium text-white/80">{f.label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="eyebrow mb-4">Nutrition Plans</p>
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Training is half the work — <span className="text-crimson-light">eating right closes the gap</span>
          </h2>
          <div className="mt-8 space-y-4">
            <div className="glass flex items-start gap-4 p-6">
              <Apple size={22} className="mt-1 shrink-0 text-crimson-light" />
              <div>
                <h3 className="font-display text-base font-bold text-white">Custom Diet Plans</h3>
                <p className="mt-1 text-sm text-white/50">
                  Your trainer builds a calorie and macro plan around your goal — cut, bulk, or maintain.
                </p>
              </div>
            </div>
            <div className="glass flex items-start gap-4 p-6">
              <Salad size={22} className="mt-1 shrink-0 text-crimson-light" />
              <div>
                <h3 className="font-display text-base font-bold text-white">Ongoing Adjustments</h3>
                <p className="mt-1 text-sm text-white/50">
                  Plans update as your progress data comes in — not a static PDF you get once.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FacilitiesNutrition;
