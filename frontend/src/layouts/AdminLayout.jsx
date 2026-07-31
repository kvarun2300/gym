import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [title, setTitle] = useState('Dashboard');

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
          <Outlet context={{ setTitle }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
