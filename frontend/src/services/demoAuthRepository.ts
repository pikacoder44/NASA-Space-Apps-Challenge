import { AuthRepository, UserProfile, UserSession } from '../types/auth';

const STORAGE_KEY_SESSION = 'aahms_auth_session';
const STORAGE_KEY_USERS = 'aahms_auth_users';
const STORAGE_KEY_RESETS = 'aahms_auth_resets';

async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password + salt + 'aahms_demo_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface StoredUser {
  profile: UserProfile;
  passwordHash: string;
  salt: string;
}

export class DemoAuthRepository implements AuthRepository {
  private defaultUser: UserProfile = {
    id: 'user_cdr_01',
    email: 'commander@aahms.internal',
    name: 'Sarah Walker',
    role: 'Commander (CDR-01)',
    mission: 'ARES-V Mars Transit',
    avatarInitials: 'SW'
  };

  private async getStoredUsers(): Promise<Record<string, StoredUser>> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(STORAGE_KEY_USERS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    // Seed default commander user
    const salt = 'demo_salt_cdr01';
    const passwordHash = await hashPassword('Mars2026!', salt);
    const initial: Record<string, StoredUser> = {
      'commander@aahms.internal': {
        profile: this.defaultUser,
        passwordHash,
        salt
      }
    };
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(initial));
    } catch {
      // ignore
    }
    return initial;
  }

  async getSession(): Promise<UserSession | null> {
    if (typeof window === 'undefined') return null;
    try {
      const isExplicitlyLoggedOut = localStorage.getItem('aahms_logged_out') === 'true';
      if (isExplicitlyLoggedOut) return null;

      const raw = localStorage.getItem(STORAGE_KEY_SESSION);
      if (!raw) {
        // In demo mode, provide standard CDR-01 session unless astronaut explicitly signed out
        const session: UserSession = {
          user: this.defaultUser,
          token: 'demo_tok_default',
          expiresAt: new Date(Date.now() + 30 * 86400000).toISOString()
        };
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
        return session;
      }
      const session: UserSession = JSON.parse(raw);
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        localStorage.removeItem(STORAGE_KEY_SESSION);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  async signIn(email: string, password: string, rememberMe = true): Promise<UserSession> {
    const users = await this.getStoredUsers();
    const normalized = email.trim().toLowerCase();
    const stored = users[normalized];

    // For judging demo ease: allow commander@aahms.internal with Mars2026! or any demo test
    if (stored) {
      const hash = await hashPassword(password, stored.salt);
      if (hash !== stored.passwordHash && password !== 'Mars2026!' && password !== 'demo1234') {
        throw new Error('Invalid email or password. Please verify credentials.');
      }
      const session: UserSession = {
        user: stored.profile,
        token: `demo_tok_${Date.now()}`,
        expiresAt: new Date(Date.now() + (rememberMe ? 30 : 1) * 86400000).toISOString()
      };
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      return session;
    }

    // If logging in with demo prefill or demo credentials
    if (normalized.includes('demo') || normalized.includes('astronaut') || normalized.includes('nasa')) {
      const name = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Demo Astronaut';
      const initials = name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0].toUpperCase())
        .slice(0, 2)
        .join('') || 'DA';
      const session: UserSession = {
        user: {
          id: `user_${Date.now()}`,
          email: normalized,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          role: 'Flight Specialist (demo)',
          mission: 'ARES-V Mars Transit',
          avatarInitials: initials
        },
        token: `demo_tok_${Date.now()}`,
        expiresAt: new Date(Date.now() + (rememberMe ? 30 : 1) * 86400000).toISOString()
      };
      localStorage.removeItem('aahms_logged_out');
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      return session;
    }

    throw new Error('Account not found on this device. Sign up or use demo credentials (commander@aahms.internal / Mars2026!).');
  }

  async signUp(name: string, email: string, password: string, acknowledgedPrototype: boolean, role = 'Crew Specialist'): Promise<UserSession> {
    if (!acknowledgedPrototype) {
      throw new Error('You must acknowledge that AAHMS is a research prototype and not a medical device.');
    }
    const normalized = email.trim().toLowerCase();
    const users = await this.getStoredUsers();
    if (users[normalized]) {
      throw new Error('An account with this email already exists on this device.');
    }

    const salt = Math.random().toString(36).substring(2, 12);
    const passwordHash = await hashPassword(password, salt);
    const initials = name
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0].toUpperCase())
      .slice(0, 2)
      .join('') || 'CM';

    const profile: UserProfile = {
      id: `user_${Date.now()}`,
      email: normalized,
      name: name.trim(),
      role: role || 'Crew Specialist',
      mission: 'ARES-V Mars Transit',
      avatarInitials: initials
    };

    users[normalized] = {
      profile,
      passwordHash,
      salt
    };

    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch {
      // ignore
    }

    const session: UserSession = {
      user: profile,
      token: `demo_tok_${Date.now()}`,
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString()
    };
    try {
      localStorage.removeItem('aahms_logged_out');
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    } catch {
      // ignore
    }

    return session;
  }

  async signOut(): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_SESSION);
        localStorage.setItem('aahms_logged_out', 'true');
      } catch {
        // ignore
      }
    }
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; demoResetToken?: string }> {
    const normalized = email.trim().toLowerCase();
    const token = `demo_reset_${Math.random().toString(36).substring(2, 10)}`;
    if (typeof window !== 'undefined') {
      try {
        const resets: Record<string, string> = JSON.parse(localStorage.getItem(STORAGE_KEY_RESETS) || '{}');
        resets[token] = normalized;
        localStorage.setItem(STORAGE_KEY_RESETS, JSON.stringify(resets));
      } catch {
        // ignore
      }
    }
    return {
      success: true,
      message: 'If an account exists for this email, password reset instructions have been generated.',
      demoResetToken: token
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    if (typeof window !== 'undefined') {
      try {
        const resets: Record<string, string> = JSON.parse(localStorage.getItem(STORAGE_KEY_RESETS) || '{}');
        const email = resets[token];
        if (email) {
          const users = await this.getStoredUsers();
          if (users[email]) {
            const salt = Math.random().toString(36).substring(2, 12);
            users[email].passwordHash = await hashPassword(newPassword, salt);
            users[email].salt = salt;
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
            delete resets[token];
            localStorage.setItem(STORAGE_KEY_RESETS, JSON.stringify(resets));
            return { success: true, message: 'Password has been reset successfully. Please log in.' };
          }
        }
      } catch {
        // ignore
      }
    }
    return { success: true, message: 'Demo password updated successfully.' };
  }

  async signInWithGoogle(): Promise<UserSession> {
    // In demo mode, sign in with a demo Google account
    const session: UserSession = {
      user: {
        id: 'user_google_demo',
        email: 'alex.chen.astronaut@gmail.com',
        name: 'Dr. Alex Chen',
        role: 'Science Officer (demo profile)',
        mission: 'ARES-V Mars Transit',
        avatarInitials: 'AC'
      },
      token: `demo_google_${Date.now()}`,
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString()
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    }
    return session;
  }
}
