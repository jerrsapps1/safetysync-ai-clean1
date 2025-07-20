import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  userTier: string;
  subscriptionStatus: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on page load
    const checkAuthStatus = async () => {
      try {
        // Check both localStorage and sessionStorage for token
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        const rememberMe = localStorage.getItem('remember_me') === 'true';
        
        if (token) {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
          } else {
            // Clear invalid tokens from both storages
            localStorage.removeItem('auth_token');
            localStorage.removeItem('remember_me');
            sessionStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('remember_me');
        sessionStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Use localStorage for "remember me", sessionStorage for temporary sessions
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('auth_token', result.token);
        storage.setItem('remember_me', rememberMe.toString());
        
        setUser(result.user);
        setIsLoading(false);
        console.log('Login successful, user set:', result.user);
        return { success: true, user: result.user };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    // Clear tokens from both storages
    localStorage.removeItem('auth_token');
    localStorage.removeItem('remember_me');
    sessionStorage.removeItem('auth_token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout
  };
}