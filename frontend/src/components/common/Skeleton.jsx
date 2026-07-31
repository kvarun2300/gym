import React from 'react';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-white/[0.06] ${className}`} />
);

export const CardSkeleton = () => (
  <div className="glass p-6 space-y-4">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

export default Skeleton;
