import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import GuestSidebar from '../components/layout/GuestSidebar';
import GuestTopbar from '../components/layout/GuestTopbar';
import api from '../lib/api';

export default function GuestLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.get('/me/notifications').then(({ data }) => {
      setUnreadCount((data?.data || []).filter((n) => !n.is_read).length);
    }).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-luxora-bg">
      <GuestSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} unreadCount={unreadCount} />
      <div className="flex-1 min-w-0 flex flex-col">
        <GuestTopbar onMenuClick={() => setMobileOpen(true)} unreadCount={unreadCount} />
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="flex-1 p-4 sm:p-6">
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
