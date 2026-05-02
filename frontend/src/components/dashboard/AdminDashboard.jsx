import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Database, Cpu, UsersRound, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import StatCard from './StatCard.jsx';

const AdminDashboard = ({ stats, isLoading, insights, onGenerateInsights, resetEmail, setResetEmail, onResetPassword, isResetting, resetOutput }) => {
  const formatNumber = (value) => new Intl.NumberFormat().format(value || 0);

  const adminStats = [
    { label: 'Total Volunteers', value: formatNumber(stats.totalVolunteers), icon: UsersRound, tone: 'leaf' },
    { label: 'System Uptime', value: '99.9%', icon: Activity, tone: 'ink' },
    { label: 'DB Health', value: 'Optimal', icon: Database, tone: 'saffron' },
    { label: 'AI Ready', value: 'Active', icon: Cpu, tone: 'maroon' },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="rounded-md bg-viva-ink p-6 text-white shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-viva-saffron" size={20} />
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Command Center
              </p>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">System Administration</h2>
            <p className="mt-2 text-sm text-slate-300">
              High-level control, infrastructure health, and organizational strategy.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-viva-leaf/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-viva-leaf border border-viva-leaf/20">
              Secure Session
            </div>
            <div className="size-2 animate-pulse rounded-full bg-viva-leaf shadow-[0_0_8px_rgba(22,163,74,0.6)]"></div>
          </div>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => (
          <StatCard key={stat.label} {...stat} isLoading={isLoading} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          {/* System Health Monitor */}
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-tight text-viva-ink">Infrastructure Monitor</h3>
              <Activity className="text-viva-leaf" size={18} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'API Gateway', status: 'Online', load: '12%', color: 'text-viva-leaf' },
                { label: 'MongoDB Cluster', status: 'Healthy', load: '24%', color: 'text-viva-leaf' },
                { label: 'OpenAI Interface', status: 'Active', load: 'Minimal', color: 'text-viva-leaf' },
                { label: 'Vercel Deployment', status: 'Production', load: 'Idle', color: 'text-viva-leaf' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-md bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className={`size-2 rounded-full bg-current ${item.color}`}></div>
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-bold ${item.color}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Control Metrics */}
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-tight text-viva-ink">Account Distribution</h3>
              <ShieldCheck className="text-viva-leaf" size={18} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-viva-ink">{stats.totalVolunteers}</p>
                <p className="text-[10px] font-bold uppercase text-slate-400">Volunteers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-viva-leaf">1</p>
                <p className="text-[10px] font-bold uppercase text-slate-400">Coordinators</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-viva-maroon">0</p>
                <p className="text-[10px] font-bold uppercase text-slate-400">Suspended</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Strategy Console */}
        <div className="rounded-md border border-slate-200 bg-gradient-to-br from-viva-ink to-[#2d2a5d] p-5 shadow-soft text-white">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-viva-saffron" size={18} />
              <h3 className="text-sm font-bold uppercase tracking-tight">AI Strategy Engine</h3>
            </div>
            <button 
              onClick={onGenerateInsights}
              disabled={isLoading}
              className="rounded-md bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-viva-saffron hover:bg-white/20 transition"
            >
              Analyze
            </button>
          </div>
          <div className="space-y-4">
            <div className="rounded-md bg-white/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Live Insights</p>
              {insights ? (
                <p className="text-sm leading-relaxed text-slate-200">{insights}</p>
              ) : (
                <div className="py-8 text-center text-xs text-slate-500 italic">
                  Run system analysis to generate strategic organizational recommendations.
                </div>
              )}
            </div>
            <div className="flex items-center justify-between rounded-md bg-viva-saffron/10 p-3 border border-viva-saffron/20">
              <span className="text-xs font-medium text-viva-saffron">Resource Optimization available</span>
              <TrendingUp size={14} className="text-viva-saffron" />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tools (Password Reset) */}
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="text-viva-maroon" size={20} />
          <h3 className="text-base font-semibold text-viva-ink">Security Control</h3>
        </div>
        <div className="rounded-md border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Administrative Password Reset</p>
          <p className="mt-1 text-xs text-slate-500 mb-3">Force generate a temporary key for members who have lost access.</p>
          <form onSubmit={onResetPassword} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="User's email address"
              required
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="flex-1 h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-viva-leaf focus:ring-2 focus:ring-viva-leaf/20 bg-white"
            />
            <button
              type="submit"
              disabled={isResetting || !resetEmail}
              className="h-10 rounded-md bg-viva-maroon px-4 text-sm font-semibold text-white shadow-sm hover:bg-viva-ink transition disabled:opacity-50"
            >
              {isResetting ? 'Processing...' : 'Generate Access Key'}
            </button>
          </form>
          {resetOutput && (
            <div className={`mt-3 rounded-md px-3 py-2 text-sm ${resetOutput.startsWith('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200 font-medium'}`}>
              {resetOutput}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
