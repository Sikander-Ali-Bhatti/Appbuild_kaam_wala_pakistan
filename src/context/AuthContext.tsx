import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, WorkerProfile, UserRole } from '../types';
import { ApiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  workerProfile: WorkerProfile | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  quickDemoLogin: (type: 'admin' | 'worker-approved' | 'worker-pending' | 'customer') => Promise<void>;
  updateWorkerProfileState: (profile: WorkerProfile) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  workerProfile: null,
  isAuthenticated: false,
  role: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  refreshUser: async () => {},
  quickDemoLogin: async () => {},
  updateWorkerProfileState: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(ApiService.getStoredUser());
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(ApiService.getStoredWorkerProfile());
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const data = await ApiService.getCurrentUser();
      setUser(data.user);
      setWorkerProfile(data.workerProfile || null);
    } catch (err) {
      // Session expired or invalid
      ApiService.clearSession();
      setUser(null);
      setWorkerProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = ApiService.getStoredUser();
    if (stored) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await ApiService.login({ email, password: pass });
    setUser(res.user);
    setWorkerProfile(res.workerProfile || null);
  };

  const logout = () => {
    ApiService.clearSession();
    setUser(null);
    setWorkerProfile(null);
  };

  const updateWorkerProfileState = (profile: WorkerProfile) => {
    setWorkerProfile(profile);
  };

  const quickDemoLogin = async (type: 'admin' | 'worker-approved' | 'worker-pending' | 'customer') => {
    setLoading(true);
    try {
      let email = 'customer@kaamwala.pk';
      let pass = 'Customer@12345';

      if (type === 'admin') {
        email = 'admin@kaamwala.pk';
        pass = 'Admin@12345';
      } else if (type === 'worker-approved') {
        email = 'tariq.electrician@gmail.com';
        pass = 'Worker@12345';
      } else if (type === 'worker-pending') {
        email = 'zahid.pending@gmail.com';
        pass = 'Worker@12345';
      } else if (type === 'customer') {
        email = 'ahmed.khan@gmail.com';
        pass = 'Customer@12345';
      }

      await login(email, pass);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workerProfile,
        isAuthenticated: !!user,
        role: user?.role || null,
        loading,
        login,
        logout,
        refreshUser,
        quickDemoLogin,
        updateWorkerProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
