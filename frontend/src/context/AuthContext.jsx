import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, login as loginRequest, register as registerRequest } from '../services/authService.js';

const TOKEN_STORAGE_KEY = 'viva_connect_token';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [isInitializing, setInitializing] = useState(Boolean(token));

  useEffect(() => {
    const hydrateUser = async () => {
      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser(token);
        setUser(currentUser);
      } catch {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    hydrateUser();
  }, [token]);

  const persistSession = (authData) => {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, authData.token);
    setToken(authData.token);
    setUser(authData.user);
  };

  const login = async (credentials) => {
    const authData = await loginRequest(credentials);
    persistSession(authData);
  };

  const register = async (credentials) => {
    const authData = await registerRequest(credentials);
    persistSession(authData);
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isInitializing,
      login,
      logout,
      register,
    }),
    [token, user, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
