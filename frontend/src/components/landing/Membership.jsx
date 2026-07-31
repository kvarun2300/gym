import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import ScrollReveal from '../common/ScrollReveal';
import { CardSkeleton } from '../common/Skeleton';
import publicService from '../../services/publicService';

const FALLBACK_PLANS = [
  {
    id: 'fallback-1',
    name: 'Basic Monthly',
    price: 1499,
    durationDays: 30,
    features: ['Gym floor access', 'Locker room', 'Fitness assessment'],
    isFeatured: false,
  },
  {
    id: 'fallback-2',
    name: 'Premium Quarterly',
    price: 3999,
    durationDays: 90,
    features: ['Gym floor access', 'Group classes', '2 PT sessions/month', 'Diet consultation'],
    isFeatured: true,
  },
  {
    id: 'fallback-3',
    name: 'Elite Annual',
    price: 14999,
    durationDays: 365,
    features: ['Unlimited PT sessions', 'Custom diet plans', 'Priority booking', 'Free merchandise'],
    isFeatured: false,
  },
];

const formatDuration = (days) => {
  if (days >= 365) return `${Math.round(days / 365)} yr`;
  if (days >= 30) return `${Math.round(days / 30)} mo`;
  return `${days} days`;
};

const Membership = () => {
  const [plans, setPlans] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    publicService
      .getPlans({ activeOnly: 'true', limit: 6 })
      .then(({ data }) => setPlans(data.data.items?.length ? data.data.items : FALLBACK_PLANS))
      .catch(() => {
        setFailed(true);
        setPlans(FALLBACK_PLANS);
      });
  }, []);

  return (
    <section id="membership" className="relative bg-black py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal className="mx-auto mb-16 max-w-xl text-center">
          <p className="eyebrow mb-4 justify-center">Membership Plans</p>
          <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
            Simple pricing, <span className="text-crimson-light">serious value</span>
          </h2>
          {failed && (
            <p className="mt-3 text-xs text-white/30">Showing standard pricing — live rates unavailable right now.</p>
          )}
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {!plans
            ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
            : plans.map((plan, i) => (
                <ScrollReveal key={plan.id} delay={i * 0.08}>
                  <div
                    className={`relative flex h-full flex-col p-8 ${
                      plan.isFeatured
                        ? 'glass border-crimson-light/50 shadow-glow-crimson-lg scale-[1.03]'
                        : 'glass glass-hover'
                    }`}
                  >
                    {plan.isFeatured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-crimson-light px-4 py-1 font-accent text-[10px] font-bold uppercase tracking-wider text-white">
                        Most Popular
                      </span>
                    )}
                    <h3 className="font-display text-xl font-bold text-white">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-display text-4xl font-extrabold text-white">₹{plan.price}</span>
                      <span className="text-sm text-white/40">/ {formatDuration(plan.durationDays)}</span>
                    </div>
                    <ul className="mt-6 flex-1 space-y-3">
                      {(plan.features || []).map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                          <Check size={16} className="mt-0.5 shrink-0 text-crimson-light" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/register"
                      className={`mt-8 text-center ${plan.isFeatured ? 'btn-cta' : 'btn-ghost'}`}
                    >
                      Choose Plan
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
        </div>
      </div>
    </section>
  );
};

export default Membership;
