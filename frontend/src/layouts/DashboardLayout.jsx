import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, UserRound } from 'lucide-react';
import Sidebar from '../components/navigation/Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const viewTitles = {
  '/dashboard': 'Overview',
  '/dashboard/volunteers': 'Volunteers',
  '/dashboard/events': 'Events',
};

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-viva-mist text-viva-ink">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={isSidebarOpen ? 'lg:pl-72' : 'lg:pl-24'}>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-viva-leaf hover:text-viva-leaf lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu size={20} />
              </button>
              <button
                type="button"
                className="hidden size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-viva-leaf hover:text-viva-leaf lg:inline-flex"
                onClick={() => setSidebarOpen((value) => !value)}
                aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-viva-leaf">
                  Ramakrishna Mission
                </p>
                <h1 className="text-lg font-semibold text-viva-ink">{viewTitles[location.pathname] || 'VIVA Connect'}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
                <span className="inline-flex size-8 items-center justify-center rounded-md bg-viva-leaf text-white">
                  <UserRound size={17} />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs capitalize text-slate-500">{user?.role}</p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-viva-maroon hover:text-viva-maroon"
                onClick={logout}
                aria-label="Logout"
                title="Logout"
              >
                <LogOut size={19} />
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
