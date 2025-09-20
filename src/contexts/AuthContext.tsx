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
      console.log('Fetching user with token...');
      
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Fetch user response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('User data received:', {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          isAdmin: data.user.isAdmin
        });
        setUser(data.user);
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
    console.log('Handling redirect for user:', {
      email: userData.email,
      isAdmin: userData.isAdmin
    });
    
    if (userData.isAdmin) {
      console.log('Redirecting admin to /admin/dashboard');
      navigate('/admin/dashboard');
    } else {
      console.log('Redirecting normal user to home page /');
      navigate('/');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Normalize inputs
      email = email.trim().toLowerCase();
      password = password.trim();
      
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Email:', email);
      console.log('API URL:', `${API_BASE_URL}/auth/login`);

      const loginPayload = { email, password };

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginPayload),
      });

      console.log('Login response status:', res.status);

      const responseText = await res.text();
      console.log('Login response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse login response:', parseError);
        throw new Error('Server returned invalid response format');
      }

      if (!res.ok) {
        console.error('Login failed:', data);
        throw new Error(data.message || `Login failed with status ${res.status}`);
      }

      console.log('✓ Login successful:', {
        hasToken: !!data.token,
        userEmail: data.user?.email,
        userIsAdmin: data.user?.isAdmin
      });

      if (!data.token) {
        throw new Error('No token received from server');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      setUser(data.user);
      
      // Redirect based on user type
      handleRedirect(data.user);
      
    } catch (err: any) {
      console.error('Login error:', err);
      throw new Error(err.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Normalize inputs
      name = name.trim();
      email = email.trim().toLowerCase();
      password = password.trim();
      
      console.log('=== REGISTRATION ATTEMPT ===');
      console.log('Name:', name);
      console.log('Email:', email);

      const registerPayload = { name, email, password };

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(registerPayload),
      });

      console.log('Registration response status:', res.status);

      const responseText = await res.text();
      console.log('Registration response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse registration response:', parseError);
        throw new Error('Server returned invalid response format');
      }

      if (!res.ok) {
        console.error('Registration failed:', data);
        throw new Error(data.message || `Registration failed with status ${res.status}`);
      }

      console.log('✓ Registration successful:', {
        hasToken: !!data.token,
        userEmail: data.user?.email,
        userIsAdmin: data.user?.isAdmin
      });

      if (!data.token) {
        throw new Error('No token received from server');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      setUser(data.user);
      
      // Redirect based on user type
      handleRedirect(data.user);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      throw new Error(err.message || 'Registration failed');
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    setUser(null);
    // Keep user on home page after logout instead of redirecting to login
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}