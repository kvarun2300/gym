import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <p className="font-display text-8xl font-extrabold text-white/10">404</p>
      <h1 className="mt-2 font-display text-2xl font-extrabold text-white">Page not found</h1>
      <p className="mt-3 max-w-sm text-sm text-white/50">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-cta mt-8">
        <Home size={16} /> Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
