import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardStats } from '../services/dashboardService.js';
import { getDashboardInsights } from '../services/aiService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { adminResetPassword } from '../services/authService.js';
import { clearStatusFlag } from '../services/userService.js';
import usePageTitle from '../hooks/usePageTitle.js';

// Role-specific Dashboards
import AdminDashboard from '../components/dashboard/AdminDashboard.jsx';
import CoordinatorDashboard from '../components/dashboard/CoordinatorDashboard.jsx';
import VolunteerDashboard from '../components/dashboard/VolunteerDashboard.jsx';

const initialStats = {
  totalVolunteers: 0,
  totalEvents: 0,
  totalPeopleServed: 0,
  totalSevaHours: 0,
  recentEvents: [],
};

const DashboardPage = () => {
  usePageTitle('Overview');
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [insights, setInsights] = useState('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  const [resetEmail, setResetEmail] = useState('');
  const [resetPasswordOutput, setResetPasswordOutput] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (user?.statusUpdateFlag && user?.statusMessage) {
      showToast(user.statusMessage, 'success');
      clearStatusFlag().catch(console.error);
    }
  }, [user, showToast]);

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      const data = await getDashboardInsights();
      setInsights(data);
    } catch (err) {
      setInsights('Failed to generate insights: ' + err.message);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleAdminReset = async (e) => {
    if (e) e.preventDefault();
    if (!resetEmail) return;
    setIsResetting(true);
    setResetPasswordOutput('');
    try {
      const data = await adminResetPassword(resetEmail);
      setResetPasswordOutput(`Success! Temporary password for ${data.user.email} is: ${data.tempPassword}`);
      setResetEmail('');
    } catch (err) {
      setResetPasswordOutput(`Error: ${err.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  const renderDashboard = () => {
    const commonProps = {
      stats,
      isLoading,
      insights,
      onGenerateInsights: handleGenerateInsights,
    };

    switch (user?.role) {
      case 'admin':
        return (
          <AdminDashboard 
            {...commonProps}
            resetEmail={resetEmail}
            setResetEmail={setResetEmail}
            onResetPassword={handleAdminReset}
            isResetting={isResetting}
            resetOutput={resetPasswordOutput}
          />
        );
      case 'coordinator':
        return <CoordinatorDashboard {...commonProps} />;
      case 'volunteer':
        return <VolunteerDashboard {...commonProps} user={user} />;
      default:
        return <VolunteerDashboard {...commonProps} user={user} />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={user?.role}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {renderDashboard()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
