import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartHandshake, Home, ArrowLeft } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle.js';

const NotFoundPage = () => {
  usePageTitle('Page Not Found');

  return (
    <main className="flex min-h-screen items-center justify-center bg-viva-mist px-4 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-viva-maroon/10 text-viva-maroon mb-6">
          <HeartHandshake size={40} />
        </div>
        
        <h1 className="text-6xl font-bold text-viva-ink tracking-tighter mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Peaceful Space, Missing Page</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          The page you are looking for might have moved or is taking a moment of silence. Let's get you back to the mission.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/"
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-viva-leaf px-8 text-sm font-semibold text-white shadow-lg transition hover:bg-viva-ink"
          >
            <Home size={18} />
            Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-8 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </motion.div>
    </main>
  );
};

export default NotFoundPage;
