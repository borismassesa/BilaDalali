import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { supabase } from '@/services/supabase';

export type UserRole = 'tenant' | 'landlord' | 'admin';

export interface UserData {
  id: string;
  email: string | null;
  display_name: string | null;
  photo_url: string | null;
  phone_number: string | null;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
  register: (email: string, password: string, role: UserRole, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch user profile data
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user data');
          } else {
            setUserData(data);
          }

          // Redirect if on auth screen
          if (router.pathname?.includes('(auth)')) {
            router.replace('/(tabs)');
          }
        } else {
          setUserData(null);
          // Redirect to login if not already there
          if (!router.pathname?.includes('(auth)') && !isLoading) {
            router.replace('/(auth)/login');
          }
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const register = async (email: string, password: string, role: UserRole, displayName: string) => {
    setError(null);
    try {
      setIsLoading(true);

      // Sign up with Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role: role,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Profile is automatically created by the database trigger
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      console.error('Registration error:', e);
      setError(e.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.replace('/(tabs)');
    } catch (e: any) {
      console.error('Login error:', e);
      setError(e.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/(auth)/login');
    } catch (e: any) {
      console.error('Logout error:', e);
      setError(e.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<UserData>) => {
    setError(null);
    if (!user) {
      setError('You must be logged in to update your profile');
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setUserData(userData ? { ...userData, ...data } : null);
    } catch (e: any) {
      console.error('Profile update error:', e);
      setError(e.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (e: any) {
      console.error('Password reset error:', e);
      setError(e.message || 'Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isLoading,
        error,
        register,
        login,
        logout,
        updateUserProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}