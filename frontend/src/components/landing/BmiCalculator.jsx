import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import ScrollReveal from '../common/ScrollReveal';

const getCategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Underweight', color: '#F59E0B' };
  if (bmi < 25) return { label: 'Healthy', color: '#22C55E' };
  if (bmi < 30) return { label: 'Overweight', color: '#F59E0B' };
  return { label: 'Obese', color: '#DC2626' };
};

const BmiCalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) return;
    setBmi(Number((w / (h * h)).toFixed(1)));
  };

  const category = bmi ? getCategory(bmi) : null;
  const circumference = 2 * Math.PI * 70;
  const clamped = bmi ? Math.min(Math.max(bmi, 10), 40) : 0;
  const dash = bmi ? ((clamped - 10) / 30) * circumference : 0;

  return (
    <section className="relative bg-black py-28">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <div className="glass grid grid-cols-1 gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-crimson/15 text-crimson-light">
                <Calculator size={22} />
              </div>
              <p className="eyebrow mb-3">Free Tool</p>
              <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                Know your <span className="text-crimson-light">BMI</span> in seconds
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                A quick starting point before you speak to one of our trainers about a plan built
                around your goals.
              </p>

              <form onSubmit={calculate} className="mt-8 grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Height (cm)</label>
                  <input
                    type="number"
                    min="50"
                    max="250"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="175"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label-field">Weight (kg)</label>
                  <input
                    type="number"
                    min="20"
                    max="300"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="70"
                    className="input-field"
                    required
                  />
                </div>
                <button type="submit" className="btn-cta col-span-2 mt-2">
                  Calculate BMI
                </button>
              </form>
            </div>

            <div className="flex flex-col items-center justify-center">
              <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
                <circle cx="90" cy="90" r="70" stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" />
                {bmi && (
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    stroke={category.color}
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - dash}
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' }}
                  />
                )}
              </svg>
              <div className="-mt-[112px] text-center">
                <p className="font-display text-4xl font-extrabold text-white">{bmi ?? '--'}</p>
                <p className="mt-1 font-accent text-xs uppercase tracking-wider" style={{ color: category?.color || '#888' }}>
                  {category?.label || 'Enter your details'}
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default BmiCalculator;
