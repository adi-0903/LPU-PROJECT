import { UserProfile } from '../types';

export interface StoredSession {
  user?: UserProfile;
  setupDone?: boolean;
  rememberMe?: boolean;
}

export type AppStage = 'loading' | 'login' | 'setup' | 'main';

export function shouldPersistSession(user: UserProfile, rememberMe: boolean): boolean {
  if (!user || user.isGuest) {
    return false;
  }
  return Boolean(rememberMe);
}

export function shouldRestoreSession(saved: StoredSession | null | undefined): boolean {
  if (!saved || !saved.user) {
    return false;
  }
  if (saved.user.isGuest) {
    return false;
  }
  return saved.rememberMe === true;
}

export function resolveAppStage(params: {
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedSetup: boolean;
}): AppStage {
  if (params.isLoading) {
    return 'loading';
  }
  if (!params.isAuthenticated) {
    return 'login';
  }
  if (!params.hasCompletedSetup) {
    return 'setup';
  }
  return 'main';
}
