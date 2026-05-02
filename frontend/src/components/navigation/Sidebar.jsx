import { CalendarDays, HeartHandshake, LayoutDashboard, UsersRound, X, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Volunteers', path: '/dashboard/volunteers', icon: UsersRound },
  { label: 'Events', path: '/dashboard/events', icon: CalendarDays },
  { label: 'Impact', path: '/dashboard/impact', icon: HeartHandshake },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-viva-ink/35 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:w-24 lg:translate-x-0'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 rounded-md text-left transition hover:bg-viva-mist focus:outline-none focus:ring-2 focus:ring-viva-leaf/25 ${
              isOpen ? 'px-2 py-1' : 'p-1'
            }`}
            onClick={onClose}
            aria-label="Go to Overview"
            title="Overview"
          >
            <img src="/images/logo.png" alt="VIVA Connect Logo" className="h-10 w-10 object-contain rounded-md shadow-sm" />
            {isOpen && (
              <div className="leading-tight">
                <p className="font-semibold text-viva-ink">VIVA Connect</p>
                <p className="text-xs text-slate-500">Seva coordination</p>
              </div>
            )}
          </Link>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-viva-ink lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/"
              className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold mb-6 transition border border-viva-leaf/20 bg-viva-leaf/5 text-viva-leaf hover:bg-viva-leaf hover:text-white ${!isOpen ? 'lg:justify-center' : ''} w-full`}
              title="Back to Homepage"
            >
              <Home size={20} />
              {isOpen && <span>Back to Homepage</span>}
            </Link>
          </motion.div>

          {navItems.map((item) => {
            const Icon = item.icon;

            return item.disabled ? (
              <div
                key={item.label}
                className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition text-slate-600 opacity-45 cursor-not-allowed ${!isOpen ? 'lg:justify-center' : ''} w-full`}
                title={item.label}
              >
                <Icon size={20} />
                {isOpen && <span>{item.label}</span>}
              </div>
            ) : (
              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={onClose}
                  className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                    location.pathname === item.path
                      ? 'bg-viva-leaf text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-viva-ink'
                  } ${!isOpen ? 'lg:justify-center' : ''} w-full`}
                  title={item.label}
                >
                  <Icon size={20} />
                  {isOpen && <span>{item.label}</span>}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-md bg-viva-mist p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-viva-saffron">
              VIVA Connect
            </p>
            {isOpen && <p className="mt-1 text-sm text-slate-600">Service, volunteers, and impact</p>}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
