import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import VolunteersPage from './pages/VolunteersPage.jsx';
import ImpactPage from './pages/ImpactPage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import StaffGate from './pages/StaffGate.jsx';
import Sidebar from './components/navigation/Sidebar.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-viva-mist">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-2 border-slate-200 border-t-viva-leaf" />
          <p className="mt-3 text-sm font-medium text-slate-600">Preparing VIVA Connect...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const DashboardRoutes = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/events" element={<EventsPage user={user} />} />
        <Route path="/volunteers" element={<VolunteersPage user={user} />} />
        <Route path="/impact" element={<ImpactPage />} />
        {user?.role === 'admin' && <Route path="/team" element={<TeamPage />} />}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </DashboardLayout>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/staff" element={<StaffGate />} />
      <Route 
        path="/dashboard/*" 
        element={
          <ProtectedRoute>
            <DashboardRoutes />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
