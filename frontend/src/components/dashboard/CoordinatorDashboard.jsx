import { motion } from 'framer-motion';
import { CalendarDays, HeartHandshake, UsersRound, ClipboardCheck, LayoutGrid, Clock3, Sparkles } from 'lucide-react';
import StatCard from './StatCard.jsx';

const CoordinatorDashboard = ({ stats, isLoading, insights, onGenerateInsights }) => {
  const formatNumber = (value) => new Intl.NumberFormat().format(value || 0);
  
  const formatEventDate = (value) => {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  };

  const operationalStats = [
    { label: 'Active Volunteers', value: formatNumber(stats.totalVolunteers), icon: UsersRound, tone: 'leaf' },
    { label: 'Total Events', value: formatNumber(stats.totalEvents), icon: CalendarDays, tone: 'maroon' },
    { label: 'People Served', value: formatNumber(stats.totalPeopleServed), icon: HeartHandshake, tone: 'saffron' },
    { label: 'Total Hours', value: formatNumber(stats.totalSevaHours), icon: Clock3, tone: 'ink' },
  ];

  return (
    <div className="space-y-6">
      {/* Coordinator Header */}
      <div className="rounded-md border-l-4 border-viva-leaf bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="text-viva-leaf" size={20} />
              <p className="text-xs font-semibold uppercase tracking-wide text-viva-leaf">
                Operations Hub
              </p>
            </div>
            <h2 className="mt-1 text-2xl font-semibold text-viva-ink">Event Coordination</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage seva activities, track participation, and optimize community impact.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-1.5 border border-slate-200">
            <LayoutGrid size={16} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-tighter">Operational View</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {operationalStats.map((stat) => (
          <StatCard key={stat.label} {...stat} isLoading={isLoading} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        {/* Live Event Activity */}
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="text-viva-leaf" size={20} />
              <h3 className="text-base font-semibold text-viva-ink">Live Seva Activities</h3>
            </div>
          </div>
          
          {isLoading ? (
            <div className="py-20 text-center text-sm text-slate-400 italic">Gathering operational data...</div>
          ) : stats.recentEvents.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-400">No active events recorded.</div>
          ) : (
            <div className="mt-4 space-y-3">
              {stats.recentEvents.map((event) => (
                <div key={event.id} className="group relative flex flex-col gap-3 rounded-md border border-slate-100 bg-slate-50 p-4 transition hover:border-viva-leaf/30 hover:bg-white hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-viva-ink group-hover:text-viva-leaf transition-colors">{event.title}</p>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock3 size={12} /> {formatEventDate(event.date)}</span>
                      <span className="font-medium text-slate-400 underline decoration-slate-200 underline-offset-2">{event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-viva-leaf">{formatNumber(event.peopleServed)}</span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Served</span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200"></div>
                    <button className="rounded-md p-1.5 text-slate-400 hover:bg-viva-mist hover:text-viva-leaf transition">
                      <LayoutGrid size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Operational Insight */}
        <div className="flex flex-col gap-6">
          <div className="rounded-md border border-slate-200 bg-gradient-to-br from-white to-viva-mist p-5 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-viva-leaf" size={20} />
              <h3 className="text-base font-semibold text-viva-ink">AI Dispatcher</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Real-time suggestions for volunteer allocation and event optimization.
            </p>
            {insights ? (
              <div className="rounded-md bg-white border border-slate-200 p-4 text-xs text-slate-700 leading-relaxed shadow-sm">
                {insights}
              </div>
            ) : (
              <button 
                onClick={onGenerateInsights}
                className="w-full rounded-md border border-viva-leaf bg-white py-2 text-xs font-bold uppercase tracking-widest text-viva-leaf hover:bg-viva-leaf hover:text-white transition shadow-sm"
              >
                Analyze Flow
              </button>
            )}
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-4">Impact Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                <span className="text-xs font-medium text-slate-600">Avg. Served / Event</span>
                <span className="text-lg font-bold text-viva-ink">{stats.totalEvents ? Math.round(stats.totalPeopleServed / stats.totalEvents) : 0}</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                <span className="text-xs font-medium text-slate-600">Hours / Volunteer</span>
                <span className="text-lg font-bold text-viva-ink">{stats.totalVolunteers ? Math.round(stats.totalSevaHours / stats.totalVolunteers) : 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
