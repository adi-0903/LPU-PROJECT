import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, ResidenceType, CourseType } from '../types';
import { DEMO_USER } from '../utils/validation';
import { shouldPersistSession, shouldRestoreSession, StoredSession } from '../utils/authFlow';

const SESSION_KEY = '@app_auth_session_v2';
const LEGACY_SESSION_KEY = '@app_auth_session';
const REGISTERED_USERS_KEY = '@app_registered_users';

interface StoredUserAccount {
  regNumber: string;
  password: string;
  profile: UserProfile;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedSetup: boolean;
  login: (
    regNumber: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => void;
  completeSetup: (residence: ResidenceType, course: CourseType, arrivalDate: string) => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasCompletedSetup: false,
  login: async () => ({ success: false }),
  loginAsGuest: () => {},
  completeSetup: async () => {},
  updateProfile: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasCompletedSetup, setHasCompletedSetup] = useState<boolean>(false);
  const [rememberCurrentSession, setRememberCurrentSession] = useState<boolean>(false);

  // Load existing session on boot — only if non-guest and explicitly opted in
  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Clear any legacy v1 auto-login session so fresh visits show Login screen first
        await AsyncStorage.removeItem(LEGACY_SESSION_KEY);

        // Optional ?autostart=1 helper for automated direct-to-main inspection
        if (typeof window !== 'undefined' && window.location?.search) {
          const params = new URLSearchParams(window.location.search);
          if (params.get('autostart') === '1') {
            setUser({
              name: DEMO_USER.name,
              regNumber: DEMO_USER.regNumber,
              residence: DEMO_USER.residence,
              course: DEMO_USER.course,
              arrivalDate: new Date().toISOString(),
              isGuest: false,
            });
            setIsAuthenticated(true);
            setHasCompletedSetup(true);
            setIsLoading(false);
            return;
          }
        }

        const sessionJson = await AsyncStorage.getItem(SESSION_KEY);
        if (sessionJson) {
          const parsed = JSON.parse(sessionJson) as StoredSession;
          if (shouldRestoreSession(parsed) && parsed.user) {
            setUser(parsed.user);
            setIsAuthenticated(true);
            setHasCompletedSetup(Boolean(parsed.setupDone));
            setRememberCurrentSession(true);
          } else {
            await AsyncStorage.removeItem(SESSION_KEY);
          }
        }
      } catch (e) {
        console.error('Session load error', e);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  const saveSession = async (
    userProfile: UserProfile,
    setupDone: boolean,
    rememberMe: boolean
  ) => {
    setUser(userProfile);
    setIsAuthenticated(true);
    setHasCompletedSetup(setupDone);
    setRememberCurrentSession(rememberMe);

    if (shouldPersistSession(userProfile, rememberMe)) {
      await AsyncStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ user: userProfile, setupDone, rememberMe: true })
      );
    } else {
      await AsyncStorage.removeItem(SESSION_KEY);
    }
  };

  const login = async (
    regNumber: string,
    password: string,
    rememberMe = false
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedReg = regNumber.trim();

    // Check demo user
    if (trimmedReg === DEMO_USER.regNumber && password === DEMO_USER.password) {
      const demoProfile: UserProfile = {
        name: DEMO_USER.name,
        regNumber: DEMO_USER.regNumber,
        residence: DEMO_USER.residence,
        course: DEMO_USER.course,
        arrivalDate: new Date().toISOString(),
        isGuest: false,
      };
      await saveSession(demoProfile, true, rememberMe);
      return { success: true };
    }

    // Check registered accounts in storage
    try {
      const usersJson = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
      const users: StoredUserAccount[] = usersJson ? JSON.parse(usersJson) : [];
      const match = users.find((u) => u.regNumber === trimmedReg && u.password === password);

      if (match) {
        const setupDone = Boolean(match.profile.residence && match.profile.course);
        await saveSession(match.profile, setupDone, rememberMe);
        return { success: true };
      }
    } catch {
      // ignore
    }

    return {
      success: false,
      error: 'Wrong registration number or password. Try again.',
    };
  };

  const loginAsGuest = () => {
    const guestProfile: UserProfile = {
      name: 'Guest',
      regNumber: '00000000',
      residence: 'Hostel',
      course: 'B.Tech',
      arrivalDate: new Date().toISOString(),
      isGuest: true,
    };
    // Guest sessions stay in memory only and never skip Login on next visit
    saveSession(guestProfile, true, false).catch(() => {});
  };

  const completeSetup = async (residence: ResidenceType, course: CourseType, arrivalDate: string) => {
    if (!user) return;
    const updatedUser: UserProfile = {
      ...user,
      residence,
      course,
      arrivalDate,
    };
    await saveSession(updatedUser, true, rememberCurrentSession);

    // Also update in registered list if not demo/guest
    if (!user.isGuest && user.regNumber !== DEMO_USER.regNumber) {
      try {
        const usersJson = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
        if (usersJson) {
          const users: StoredUserAccount[] = JSON.parse(usersJson);
          const index = users.findIndex((u) => u.regNumber === user.regNumber);
          if (index !== -1) {
            users[index].profile = updatedUser;
            await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
          }
        }
      } catch {
        // ignore
      }
    }
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!user) return;
    const newProfile = { ...user, ...updated };
    await saveSession(newProfile, hasCompletedSetup, rememberCurrentSession);
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    setHasCompletedSetup(false);
    setRememberCurrentSession(false);
    await Promise.all([
      AsyncStorage.removeItem(SESSION_KEY),
      AsyncStorage.removeItem(LEGACY_SESSION_KEY),
    ]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        hasCompletedSetup,
        login,
        loginAsGuest,
        completeSetup,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
