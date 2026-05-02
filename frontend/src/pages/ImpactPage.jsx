import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, TrendingUp, Users, Calendar, Award } from 'lucide-react';
import { getDashboardStats } from '../services/dashboardService.js';
import usePageTitle from '../hooks/usePageTitle.js';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const formatNumber = (value) => new Intl.NumberFormat().format(value || 0);

const ImpactPage = () => {
  usePageTitle('Community Impact');
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    totalEvents: 0,
    totalPeopleServed: 0,
    totalSevaHours: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch impact stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.section variants={itemVariants} className="rounded-md border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-viva-maroon/10 text-viva-maroon">
            <HeartHandshake size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-viva-ink tracking-tight">Community Impact</h2>
            <p className="text-sm text-slate-500">Measuring the ripple effect of our seva across the community.</p>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Total Reach</h3>
            <Users className="text-viva-leaf" size={20} />
          </div>
          <p className="text-3xl font-bold text-viva-ink">
            {isLoading ? '...' : `${formatNumber(stats.totalPeopleServed)}+`}
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">Individuals served from our mission</p>
          <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: isLoading ? 0 : '75%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-viva-leaf"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Service Hours</h3>
            <Calendar className="text-viva-saffron" size={20} />
          </div>
          <p className="text-3xl font-bold text-viva-ink">
            {isLoading ? '...' : formatNumber(stats.totalSevaHours)}
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">Total volunteer hours recorded</p>
          <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: isLoading ? 0 : '85%' }}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-full bg-viva-saffron"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Our Events</h3>
            <TrendingUp className="text-indigo-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-viva-ink">
            {isLoading ? '...' : formatNumber(stats.totalEvents)}
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">Total seva activities conducted</p>
          <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: isLoading ? 0 : '60%' }}
              transition={{ duration: 1, delay: 0.7 }}
              className="h-full bg-indigo-600"
            />
          </div>
        </motion.div>
      </div>

      <motion.section variants={itemVariants} className="rounded-md border border-viva-leaf/20 bg-viva-mist/50 p-8 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-viva-leaf/10 text-viva-leaf mb-4">
          <Award size={32} />
        </div>
        <h3 className="text-xl font-bold text-viva-ink">Impact Visualizations Coming Soon</h3>
        <p className="mt-2 text-slate-600 max-w-lg mx-auto">
          We are building advanced data visualization tools to help us see the geographic spread and long-term trends of our organizational impact.
        </p>
        <button className="mt-6 rounded-md bg-viva-leaf px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-viva-ink transition-all">
          Request Early Access
        </button>
      </motion.section>
    </motion.div>
  );
};

export default ImpactPage;
