import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { SystemGuideModal } from '../components/SystemGuideModal';

export const MainLayout = () => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsGuideOpen(true);
    window.addEventListener('open-system-guide', handleOpen);
    return () => window.removeEventListener('open-system-guide', handleOpen);
  }, []);

  return (
    <div className="app-layout">
      <Sidebar onOpenGuide={() => setIsGuideOpen(true)} />
      <main className="main-content">
        <Outlet />
      </main>
      <SystemGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};
