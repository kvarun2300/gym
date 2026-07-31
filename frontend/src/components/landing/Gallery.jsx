import React, { useEffect, useState } from 'react';
import ScrollReveal from '../common/ScrollReveal';
import Skeleton from '../common/Skeleton';
import publicService from '../../services/publicService';

const PLACEHOLDER_COUNT = 6;

const Gallery = () => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    publicService
      .getGallery({ limit: 6 })
      .then(({ data }) => setItems(data.data.items || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <section id="gallery" className="relative bg-black-soft/40 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal className="mb-14 max-w-xl">
          <p className="eyebrow mb-4">Transformation Gallery</p>
          <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
            Real members, <span className="text-crimson-light">real results</span>
          </h2>
        </ScrollReveal>

        {items && items.length === 0 ? (
          <div className="glass p-12 text-center text-sm text-white/40">
            Transformation photos will appear here as members share their progress.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {!items
              ? Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full" />
                ))
              : items.map((item, i) => (
                  <ScrollReveal key={item.id} delay={i * 0.05} className="group relative aspect-square overflow-hidden rounded-2xl">
                    <img
                      src={item.imageUrl}
                      alt={item.title || 'Transformation'}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="font-accent text-xs font-medium text-white">{item.title}</p>
                    </div>
                  </ScrollReveal>
                ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
