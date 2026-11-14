'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { UserSession, UserProfile, AuthRepository } from '../types/auth';
import { DemoAuthRepository } from '../services/demoAuthRepository';

interface AuthContextType {
  session: UserSession | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logoutToast: string | null;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<UserSession>;
  signUp: (name: string, email: string, password: string, acknowledgedPrototype: boolean, role?: string) => Promise<UserSession>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<UserSession>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string; demoResetToken?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  clearLogoutToast: () => void;
  repository: AuthRepository;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logoutToast, setLogoutToast] = useState<string | null>(null);

  // Singleton demo repository
  const repository = useMemo<AuthRepository>(() => new DemoAuthRepository(), []);

  useEffect(() => {
    let isMounted = true;
    repository.getSession().then((s) => {
      if (isMounted) {
        setSession(s);
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [repository]);

  const signIn = async (email: string, password: string, rememberMe = true) => {
    const s = await repository.signIn(email, password, rememberMe);
    setSession(s);
    return s;
  };

  const signUp = async (name: string, email: string, password: string, acknowledgedPrototype: boolean, role?: string) => {
    const s = await repository.signUp(name, email, password, acknowledgedPrototype, role);
    setSession(s);
    return s;
  };

  const signOut = async () => {
    await repository.signOut();
    setSession(null);
    setLogoutToast('You have been logged out.');
    setTimeout(() => {
      setLogoutToast(null);
    }, 4500);
  };

  const signInWithGoogle = async () => {
    const s = await repository.signInWithGoogle();
    setSession(s);
    return s;
  };

  const requestPasswordReset = async (email: string) => {
    return repository.requestPasswordReset(email);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    return repository.resetPassword(token, newPassword);
  };

  const clearLogoutToast = () => setLogoutToast(null);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        isAuthenticated: !!session,
        isLoading,
        logoutToast,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        requestPasswordReset,
        resetPassword,
        clearLogoutToast,
        repository
      }}
    >
      {children}
      {/* Logout Toast Notification */}
      {logoutToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#122B31] text-white text-sm px-4 py-3 rounded-xl shadow-xl border border-[#1E434C] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2"
        >
          <span className="w-2 h-2 rounded-full bg-[#176B68]" />
          <span>{logoutToast}</span>
          <button
            type="button"
            onClick={clearLogoutToast}
            className="text-xs text-[#DCEDEA] hover:text-white ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
