'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { UserSession, UserProfile, AuthRepository } from '../types/auth';
import { DemoAuthRepository } from '../services/demoAuthRepository';
import { loginUser, registerUser, getMe, getToken, setToken, clearToken } from '../lib/api';

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

  // Match backend ACCESS_TOKEN_EXPIRE_MINUTES (30 minutes)
  const SESSION_DURATION_MS = 30 * 60 * 1000;

  // Singleton demo repository for demo mode
  const repository = useMemo<AuthRepository>(() => new DemoAuthRepository(), []);
  const useLiveApi = process.env.NEXT_PUBLIC_USE_API === 'true';

  useEffect(() => {
    let isMounted = true;

    // Listen for global 401 unauthorized events from apiClient / lib/api
    const handleUnauthorized = () => {
      clearToken();
      repository.signOut().catch(() => {});
      setSession(null);
      setLogoutToast('Your session has expired. Please log in again.');
      setTimeout(() => {
        setLogoutToast(null);
      }, 5000);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:unauthorized', handleUnauthorized);
    }

    // Check if we have an active backend token in localStorage
    const liveToken = getToken();
    if (useLiveApi && liveToken) {
      getMe().then((me) => {
        if (isMounted) {
          const liveSession: UserSession = {
            token: liveToken,
            expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
            user: {
              id: me.id,
              name: me.name,
              email: me.email,
              role: me.role || 'CDR-01',
              mission: 'AstroTrack Mars Transit Sol 90',
              avatarInitials: me.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CM'
            }
          };
          setSession(liveSession);
          setIsLoading(false);
        }
      }).catch(() => {
        if (isMounted) {
          // Token invalid or expired
          clearToken();
          repository.getSession().then((s) => {
            if (isMounted) {
              setSession(s);
              setIsLoading(false);
            }
          });
        }
      });
    } else {
      repository.getSession().then((s) => {
        if (isMounted) {
          // Validate expiration if present
          if (s && s.expiresAt && new Date(s.expiresAt).getTime() <= Date.now()) {
            repository.signOut().catch(() => {});
            setSession(null);
            setLogoutToast('Your session has expired. Please log in again.');
          } else {
            setSession(s);
          }
          setIsLoading(false);
        }
      }).catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    }

    // Periodic check every 30 seconds for session expiration
    const expiryInterval = setInterval(() => {
      setSession((currentSession) => {
        if (currentSession && currentSession.expiresAt) {
          if (new Date(currentSession.expiresAt).getTime() <= Date.now()) {
            clearToken();
            repository.signOut().catch(() => {});
            setLogoutToast('Your session has expired (30 minutes). Please log in again.');
            return null;
          }
        }
        return currentSession;
      });
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(expiryInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth:unauthorized', handleUnauthorized);
      }
    };
  }, [repository, useLiveApi, SESSION_DURATION_MS]);

  const signIn = async (email: string, password: string, rememberMe = true) => {
    if (useLiveApi) {
      try {
        const authRes = await loginUser(email, password);
        setToken(authRes.access_token);
        const me = await getMe();
        const liveSession: UserSession = {
          token: authRes.access_token,
          expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
          user: {
            id: me.id,
            name: me.name,
            email: me.email,
            role: me.role || 'CDR-01',
            mission: 'AstroTrack Mars Transit Sol 90',
            avatarInitials: me.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CM'
          }
        };
        setSession(liveSession);
        return liveSession;
      } catch (err) {
        console.warn('Backend login failed, using demo auth fallback:', err);
      }
    }
    // Salted-hash demo auth fallback
    const s = await repository.signIn(email, password, rememberMe);
    setSession(s);
    return s;
  };

  const signUp = async (name: string, email: string, password: string, acknowledgedPrototype: boolean, role?: string) => {
    if (useLiveApi) {
      try {
        await registerUser(email, password, name, role);
        return await signIn(email, password);
      } catch (err) {
        console.warn('Backend registration failed, using demo fallback:', err);
      }
    }
    const s = await repository.signUp(name, email, password, acknowledgedPrototype, role);
    setSession(s);
    return s;
  };

  const signOut = async () => {
    clearToken();
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

  const value = useMemo<AuthContextType>(
    () => ({
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
    }),
    [session, isLoading, logoutToast, repository]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
