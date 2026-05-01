import { useEffect, useState } from 'react';
import { CalendarDays, Clock3, HeartHandshake, UsersRound, Sparkles, ShieldAlert } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard.jsx';
import { getDashboardStats } from '../services/dashboardService.js';
import { getDashboardInsights } from '../services/aiService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { adminResetPassword } from '../services/authService.js';

const initialStats = {
  totalVolunteers: 0,
  totalEvents: 0,
  totalPeopleServed: 0,
  totalSevaHours: 0,
  recentEvents: [],
};

const formatNumber = (value) => new Intl.NumberFormat().format(value || 0);

const formatEventDate = (value) => {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const DashboardPage = () => {
  const { user } = useAuth();
  const isAdmin = ['admin', 'coordinator'].includes(user?.role);
  
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [insights, setInsights] = useState('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  const [resetEmail, setResetEmail] = useState('');
  const [resetPasswordOutput, setResetPasswordOutput] = useState('');
  const [isResetting, setIsResetting] = useState(false);

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
    e.preventDefault();
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

  const statCards = [
    { label: 'Volunteers', value: formatNumber(stats.totalVolunteers), icon: UsersRound, tone: 'leaf' },
    { label: 'Events', value: formatNumber(stats.totalEvents), icon: CalendarDays, tone: 'maroon' },
    { label: 'People Served', value: formatNumber(stats.totalPeopleServed), icon: HeartHandshake, tone: 'saffron' },
    { label: 'Seva Hours', value: formatNumber(stats.totalSevaHours), icon: Clock3, tone: 'ink' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-viva-leaf">
              Welcome
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-viva-ink">Impact Overview</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            A shared view of volunteers, seva activities, service hours, and community impact.
          </p>
        </div>
      </section>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} isLoading={isLoading} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-viva-ink">Upcoming Events</h3>
              <p className="mt-1 text-sm text-slate-500">Recent seva activity from your records.</p>
            </div>
            <CalendarDays className="text-viva-leaf" size={22} />
          </div>
          {isLoading ? (
            <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              Gathering recent seva activity...
            </div>
          ) : stats.recentEvents.length === 0 ? (
            <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              No seva activities have been recorded yet.
            </div>
          ) : (
            <div className="mt-5 divide-y divide-slate-100">
              {stats.recentEvents.map((event) => (
                <div key={event.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-viva-ink">{event.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatEventDate(event.date)} · {event.location}
                    </p>
                  </div>
                  <span className="rounded-md bg-viva-mist px-3 py-1 text-sm font-semibold text-viva-leaf">
                    {formatNumber(event.peopleServed)} served
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-viva-ink">Impact Summary</h3>
              <p className="mt-1 text-sm text-slate-500">Current totals across VIVA service work.</p>
            </div>
            <UsersRound className="text-viva-maroon" size={22} />
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-3">
              <span className="text-sm font-medium text-slate-700">Average people served per event</span>
              <span className="text-sm font-semibold text-viva-ink">
                {stats.totalEvents ? formatNumber(Math.round(stats.totalPeopleServed / stats.totalEvents)) : '0'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-3">
              <span className="text-sm font-medium text-slate-700">Average seva hours per volunteer</span>
              <span className="text-sm font-semibold text-viva-ink">
                {stats.totalVolunteers ? formatNumber(Math.round(stats.totalSevaHours / stats.totalVolunteers)) : '0'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-3">
              <span className="text-sm font-medium text-slate-700">Tracked recent events</span>
              <span className="text-sm font-semibold text-viva-ink">{stats.recentEvents.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Insights Section */}
      <section className="rounded-md border border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-5 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={20} />
              <h3 className="text-base font-semibold text-indigo-900">AI Insight Assistant</h3>
            </div>
            <p className="mt-1 text-sm text-indigo-700">Generate actionable insights based on your current organizational impact.</p>
          </div>
          <button
            onClick={handleGenerateInsights}
            disabled={isGeneratingInsights}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
          >
            {isGeneratingInsights ? 'Analyzing...' : 'Generate Insights'}
          </button>
        </div>
        {insights && (
          <div className="mt-4 rounded-md border border-indigo-100 bg-white p-4 text-sm text-slate-700 shadow-sm leading-relaxed whitespace-pre-wrap">
            {insights}
          </div>
        )}
      </section>

      {/* Admin Tools Section */}
      {isAdmin && (
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="text-viva-maroon" size={20} />
            <h3 className="text-base font-semibold text-viva-ink">Admin Tools</h3>
          </div>
          
          <div className="rounded-md border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Reset User Password</p>
            <p className="mt-1 text-xs text-slate-500 mb-3">Generate a temporary password for a user who has lost access.</p>
            
            <form onSubmit={handleAdminReset} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="User's email address"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="flex-1 h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-viva-leaf focus:ring-2 focus:ring-viva-leaf/20"
              />
              <button
                type="submit"
                disabled={isResetting || !resetEmail}
                className="h-10 rounded-md bg-viva-maroon px-4 text-sm font-semibold text-white shadow-sm hover:bg-viva-ink transition disabled:opacity-50"
              >
                {isResetting ? 'Resetting...' : 'Generate Temporary Password'}
              </button>
            </form>
            
            {resetPasswordOutput && (
              <div className={`mt-3 rounded-md px-3 py-2 text-sm ${resetPasswordOutput.startsWith('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200 font-medium'}`}>
                {resetPasswordOutput}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardPage;
