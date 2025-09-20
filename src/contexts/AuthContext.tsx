import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUser(token);
    else setLoading(false);
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user.isAdmin) navigate('/admin/dashboard');
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Fetch user error:', err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = (userData: User) => {
    if (userData.isAdmin) navigate('/admin/dashboard');
    else navigate('/');
  };

  const login = async (email: string, password: string) => {
    try {
      email = email.trim();
      password = password.trim();
      console.log('Login payload:', { email, password }); // DEBUG

      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      handleRedirect(data.user);
    } catch (err: any) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      name = name.trim();
      email = email.trim();
      password = password.trim();
      console.log('Register payload:', { name, email, password }); // DEBUG

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      handleRedirect(data.user);
    } catch (err: any) {
      console.error('Register error:', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
