import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import ScrollReveal from '../common/ScrollReveal';
import { CardSkeleton } from '../common/Skeleton';
import publicService from '../../services/publicService';

const FALLBACK_TRAINERS = [
  { id: 1, user: { name: 'Arjun Rao', profileImage: null }, specialization: 'Strength & Powerlifting', experienceYears: 7, rating: 4.9 },
  { id: 2, user: { name: 'Divya Shetty', profileImage: null }, specialization: 'HIIT & Conditioning', experienceYears: 5, rating: 4.8 },
  { id: 3, user: { name: 'Karthik Nair', profileImage: null }, specialization: 'Bodybuilding', experienceYears: 9, rating: 5.0 },
];

const Trainers = () => {
  const [trainers, setTrainers] = useState(null);

  useEffect(() => {
    publicService
      .getTrainers({ limit: 6 })
      .then(({ data }) => setTrainers(data.data.items?.length ? data.data.items : FALLBACK_TRAINERS))
      .catch(() => setTrainers(FALLBACK_TRAINERS));
  }, []);

  return (
    <section id="trainers" className="relative bg-black-soft/40 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal className="mb-14 max-w-xl">
          <p className="eyebrow mb-4">Meet The Team</p>
          <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
            Trainers who <span className="text-crimson-light">show up for you</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {!trainers
            ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
            : trainers.map((t, i) => (
                <ScrollReveal key={t.id} delay={i * 0.08}>
                  <div className="glass glass-hover p-7 text-center">
                    <div className="relative mx-auto mb-5 h-24 w-24">
                      <span className="ring-mark inset-0" />
                      {t.user?.profileImage ? (
                        <img
                          src={t.user.profileImage}
                          alt={t.user.name}
                          className="h-full w-full rounded-full object-cover p-1"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-crimson/15 font-display text-2xl font-bold text-crimson-light">
                          {t.user?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">{t.user?.name}</h3>
                    <p className="mt-1 text-xs font-accent uppercase tracking-wide text-crimson-light">
                      {t.specialization}
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-4 text-xs text-white/40">
                      <span>{t.experienceYears}+ yrs exp.</span>
                      <span className="flex items-center gap-1">
                        <Star size={12} className="fill-warning text-warning" /> {t.rating}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
        </div>
      </div>
    </section>
  );
};

export default Trainers;
