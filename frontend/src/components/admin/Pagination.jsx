import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages, total, limit, onPageChange }) => {
  if (!total) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] px-1 pt-5 sm:flex-row">
      <p className="text-xs text-white/40">
        Showing <span className="text-white/70">{start}-{end}</span> of <span className="text-white/70">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:border-crimson-light hover:text-crimson-light disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/60"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="px-2 font-accent text-xs text-white/60">
          Page {page} / {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:border-crimson-light hover:text-crimson-light disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/60"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
