import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      console.log('Fetching user with token:', token.substring(0, 20) + '...');
      
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Fetch user response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('User data received:', data);
        setUser(data.user);
        
        // Don't auto-redirect on initial load, let the user choose where to go
        // if (data.user.isAdmin) navigate('/admin/dashboard');
      } else {
        console.log('Token invalid or expired, removing from storage');
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
    console.log('Redirecting user:', userData);
    if (userData.isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard'); // Changed to a user dashboard instead of home
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Trim inputs
      email = email.trim().toLowerCase(); // Also normalize email to lowercase
      password = password.trim();
      
      console.log('Login attempt for email:', email);
      console.log('API URL:', `${API_BASE_URL}/auth/login`);

      const loginPayload = { email, password };
      console.log('Login payload:', { email, password: '***' }); // Don't log actual password

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginPayload),
      });

      console.log('Login response status:', res.status);
      console.log('Login response headers:', Object.fromEntries(res.headers.entries()));

      const responseText = await res.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned invalid response format');
      }

      if (!res.ok) {
        console.error('Login failed with data:', data);
        throw new Error(data.message || `Login failed with status ${res.status}`);
      }

      console.log('Login successful:', { user: data.user, hasToken: !!data.token });

      if (!data.token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      handleRedirect(data.user);
    } catch (err: any) {
      console.error('Login error:', err);
      // Re-throw the error so the UI can show it
      throw new Error(err.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Trim and normalize inputs
      name = name.trim();
      email = email.trim().toLowerCase();
      password = password.trim();
      
      console.log('Register attempt for:', { name, email });

      const registerPayload = { name, email, password };

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(registerPayload),
      });

      console.log('Register response status:', res.status);

      const responseText = await res.text();
      console.log('Register raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned invalid response format');
      }

      if (!res.ok) {
        console.error('Registration failed with data:', data);
        throw new Error(data.message || `Registration failed with status ${res.status}`);
      }

      console.log('Registration successful:', { user: data.user, hasToken: !!data.token });

      if (!data.token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      handleRedirect(data.user);
    } catch (err: any) {
      console.error('Register error:', err);
      throw new Error(err.message || 'Registration failed');
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login'); // Redirect to login page instead of home
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}