import { useState } from 'react';
import { HeartHandshake, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import TextField from '../components/forms/TextField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import EmergencyCall from '../components/common/EmergencyCall.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'volunteer',
};

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const isRegisterMode = mode === 'register';
  usePageTitle(isRegisterMode ? 'Join Us' : 'Sign In');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isRegisterMode) {
        await register(form);
      } else {
        await login({
          email: form.email,
          password: form.password,
        });
      }
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-viva-mist px-4 py-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-soft lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-viva-ink p-6 text-white sm:p-8">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="flex size-12 items-center justify-center rounded-md bg-viva-saffron">
            <HeartHandshake size={25} />
          </div>
          <h1 className="mt-6 text-3xl font-semibold">VIVA Connect</h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-200">
            A calm space for coordinators, administrators, and volunteers to care for service work.
          </p>
          <div className="mt-8 rounded-md border border-white/15 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-viva-saffron">
              Seva Records
            </p>
            <p className="mt-2 text-sm text-slate-200">Organized access for trusted members of the VIVA family.</p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6 inline-flex rounded-md border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              className={`inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold transition ${
                !isRegisterMode ? 'bg-white text-viva-ink shadow-sm' : 'text-slate-500 hover:text-viva-ink'
              }`}
              onClick={() => setMode('login')}
            >
              <LogIn size={17} />
              Sign in
            </button>
            <button
              type="button"
              className={`inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold transition ${
                isRegisterMode ? 'bg-white text-viva-ink shadow-sm' : 'text-slate-500 hover:text-viva-ink'
              }`}
              onClick={() => setMode('register')}
            >
              <UserPlus size={17} />
              Join
            </button>
          </div>

          <h2 className="text-2xl font-semibold text-viva-ink">
            {isRegisterMode ? 'Join VIVA Connect' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {isRegisterMode ? 'Create a member profile for VIVA Connect.' : 'Sign in to continue your seva coordination.'}
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {isRegisterMode && (
              <TextField
                id="name"
                label="Full name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                minLength={2}
                autoComplete="name"
              />
            )}

            <TextField
              id="email"
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <div className="space-y-1">
              <TextField
                id="password"
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={isRegisterMode ? 8 : 1}
                autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
              />
              {!isRegisterMode && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => showToast('Please contact your VIVA Connect Administrator or Coordinator to receive a temporary password.', 'info')}
                    className="text-xs font-medium text-viva-leaf hover:text-viva-ink transition-colors mt-1"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>

            {isRegisterMode && (
              <label className="block" htmlFor="role">
                <span className="text-sm font-medium text-slate-700">Role</span>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="mt-2 block h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-viva-ink shadow-sm outline-none transition focus:border-viva-leaf focus:ring-2 focus:ring-viva-leaf/20"
                >
                  <option value="volunteer">Volunteer</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            )}

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-viva-leaf px-4 text-sm font-semibold text-white transition hover:bg-viva-ink disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Please wait...' : isRegisterMode ? 'Create member profile' : 'Sign in'}
            </button>
          </form>
        </div>
      </section>

      <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-medium text-slate-500">
            &copy; {new Date().getFullYear()} <span className="text-viva-ink">Ramakrishna Mission VIVA Connect</span>. All rights reserved.
          </p>
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-viva-saffron to-viva-leaf opacity-40"></div>
        </div>
        
        <p className="text-[10px] tracking-wide text-slate-400 uppercase font-semibold">
          Engineered by 
          <span className="ml-1 text-viva-leaf font-bold">
            Engr. Philip J. Dolo
          </span>
        </p>
      </div>
      <EmergencyCall />
    </main>
  );
};

export default AuthPage;
