export type MissionRole = 'Commander' | 'Medical Officer' | 'Science Officer' | 'Flight Engineer' | 'Mission Specialist';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  mission: string;
  avatarInitials: string;
}

export interface UserSession {
  user: UserProfile;
  token: string;
  expiresAt: string;
}

export interface AuthRepository {
  getSession(): Promise<UserSession | null>;
  signIn(email: string, password: string, rememberMe?: boolean): Promise<UserSession>;
  signUp(name: string, email: string, password: string, acknowledgedPrototype: boolean, role?: string): Promise<UserSession>;
  signOut(): Promise<void>;
  requestPasswordReset(email: string): Promise<{ success: boolean; message: string; demoResetToken?: string }>;
  resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }>;
  signInWithGoogle(): Promise<UserSession>;
}
