import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('ss_token');
    const savedUser = localStorage.getItem('ss_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('ss_token');
        localStorage.removeItem('ss_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('ss_token', jwtToken);
    localStorage.setItem('ss_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
  };

  const getDashboardRoute = (role) => {
    switch (role?.toUpperCase()) {
      case 'DONOR':     return '/donor/dashboard';
      case 'NGO':       return '/ngo/dashboard';
      case 'VOLUNTEER': return '/volunteer/dashboard';
      case 'ADMIN':     return '/admin/dashboard';
      default:          return '/';
    }
  };

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, getDashboardRoute, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
