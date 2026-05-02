import { useState } from 'react';
import { Shield, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import TextField from '../components/forms/TextField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

const StaffGate = () => {
  usePageTitle('Staff Access');
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(form);
      showToast('Administrative access granted.', 'success');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-viva-ink px-4 py-8 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-viva-saffron/20 via-transparent to-transparent"></div>
      </div>

      <section className="w-full max-w-md relative z-10">
        <div className="mb-8 flex justify-center">
          <Link to="/auth" className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition">
            <ArrowLeft size={14} />
            Back to Public Portal
          </Link>
        </div>

        <div className="rounded-md border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="flex size-14 items-center justify-center rounded-full bg-viva-maroon text-white shadow-lg ring-4 ring-viva-maroon/20">
              <Shield size={28} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-white tracking-tight">VIVA COMMAND CENTER</h1>
            <p className="mt-2 text-sm text-slate-400">Restricted access for Coordinators & Administrators only.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Institutional Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full h-12 rounded bg-white/10 border border-white/10 px-4 text-white text-sm outline-none focus:border-viva-saffron focus:ring-1 focus:ring-viva-saffron/50 transition-all placeholder:text-slate-600"
                placeholder="admin@viva.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Access Credentials</label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full h-12 rounded bg-white/10 border border-white/10 px-4 text-white text-sm outline-none focus:border-viva-saffron focus:ring-1 focus:ring-viva-saffron/50 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 flex items-center gap-2">
                <Lock size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 flex items-center justify-center gap-2 rounded bg-viva-maroon text-sm font-bold text-white hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg"
            >
              {isSubmitting ? 'Verifying...' : (
                <>
                  Authorize Access
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em]">
              Security Protocol Level 4 Active
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto">
          Unauthorized access attempts are logged and reported to the system administrator.
          VIVA Connect Security Infrastructure.
        </p>
      </section>
    </main>
  );
};

export default StaffGate;
