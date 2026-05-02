import { motion } from 'framer-motion';
import { HeartHandshake, CalendarDays, Award, Star, History, ArrowUpRight, Sparkles } from 'lucide-react';
import StatCard from './StatCard.jsx';

const VolunteerDashboard = ({ stats, isLoading, insights, onGenerateInsights, user }) => {
  const formatNumber = (value) => new Intl.NumberFormat().format(value || 0);
  
  const formatEventDate = (value) => {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(value));
  };

  const personalStats = [
    { label: 'Events Joined', value: '12', icon: CalendarDays, tone: 'leaf' },
    { label: 'Seva Hours', value: formatNumber(stats.totalSevaHours / 10), icon: Star, tone: 'saffron' },
    { label: 'Impact Rank', value: 'Gold', icon: Award, tone: 'maroon' },
    { label: 'Global Served', value: formatNumber(stats.totalPeopleServed), icon: HeartHandshake, tone: 'ink' },
  ];

  return (
    <div className="space-y-6">
      {/* Volunteer Header */}
      <div className="relative overflow-hidden rounded-md bg-gradient-to-r from-viva-leaf/10 via-white to-viva-saffron/10 p-6 border border-slate-100 shadow-soft">
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-viva-leaf mb-1">My Seva Journey</p>
          <h2 className="text-3xl font-bold text-viva-ink">Namaste, {user?.name?.split(' ')[0]}!</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Thank you for your selfless service. Every hour you contribute strengthens our mission and brings light to the community.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-full bg-viva-leaf/10 px-4 py-1.5 text-xs font-bold text-viva-leaf border border-viva-leaf/20">
              <Star size={14} fill="currentColor" /> Level 4 Seva Member
            </div>
            <div className="flex items-center gap-2 rounded-full bg-viva-saffron/10 px-4 py-1.5 text-xs font-bold text-viva-saffron border border-viva-saffron/20">
              <Award size={14} /> 5-Star Reliable
            </div>
          </div>
        </div>
        <div className="absolute -right-12 -top-12 size-64 rounded-full bg-viva-leaf/5 blur-3xl"></div>
        <div className="absolute -bottom-12 right-24 size-48 rounded-full bg-viva-saffron/5 blur-3xl"></div>
      </div>

      {/* Personal Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {personalStats.map((stat) => (
          <StatCard key={stat.label} {...stat} isLoading={isLoading} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Participation History */}
        <div className="rounded-md border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-viva-ink">
              <History size={20} className="text-viva-maroon" />
              <h3 className="text-base font-bold">Recent Participation</h3>
            </div>
          </div>
          
          <div className="space-y-6">
            {stats.recentEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-[2px] before:bg-slate-100 last:before:hidden">
                <div className="absolute left-[-4px] top-2 size-2 rounded-full bg-viva-maroon ring-4 ring-white"></div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{formatEventDate(event.date)}</p>
                <h4 className="mt-1 text-sm font-bold text-viva-ink">{event.title}</h4>
                <p className="mt-1 text-xs text-slate-500">{event.location}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-[10px] font-bold text-viva-leaf uppercase bg-viva-leaf/5 px-2 py-0.5 rounded border border-viva-leaf/10">Completed</span>
                  <span className="text-[10px] font-medium text-slate-400">4 hours recorded</span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
            View Full History <ArrowUpRight size={14} />
          </button>
        </div>

        {/* AI Learning & Opportunities */}
        <div className="space-y-6">
          <div className="rounded-md bg-viva-ink p-6 text-white shadow-soft relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-viva-saffron" size={20} />
                <h3 className="text-base font-bold">Personal Growth Assistant</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Discover new ways to serve based on your skills and past participation.
              </p>
              {insights ? (
                <div className="rounded-md bg-white/5 border border-white/10 p-4 text-xs text-slate-200 leading-relaxed italic">
                  "{insights}"
                </div>
              ) : (
                <button 
                  onClick={onGenerateInsights}
                  className="rounded-md bg-viva-saffron px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-viva-ink hover:bg-white transition shadow-lg"
                >
                  Find My Path
                </button>
              )}
            </div>
            <div className="absolute -bottom-8 -right-8 size-32 rounded-full bg-white/5 blur-2xl"></div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-sm font-bold uppercase tracking-widest text-viva-ink mb-4">Milestones</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'First Seva', active: true },
                { label: '10 Events', active: true },
                { label: '100 Served', active: false },
                { label: 'Night Shift', active: true },
                { label: 'Skill Master', active: false },
                { label: 'Leader', active: false },
              ].map((m) => (
                <div key={m.label} className={`flex aspect-square flex-col items-center justify-center rounded-md border p-2 text-center transition ${m.active ? 'border-viva-leaf/30 bg-viva-leaf/5 text-viva-leaf' : 'border-slate-100 bg-slate-50 text-slate-300 grayscale'}`}>
                  <Award size={20} className="mb-1" />
                  <span className="text-[8px] font-bold uppercase tracking-tighter leading-tight">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
