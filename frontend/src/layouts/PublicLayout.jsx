import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-black bg-grain">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
