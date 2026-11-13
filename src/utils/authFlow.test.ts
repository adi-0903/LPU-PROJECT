import test from 'node:test';
import assert from 'node:assert/strict';
import {
  shouldPersistSession,
  shouldRestoreSession,
  resolveAppStage,
} from './authFlow';
import { UserProfile } from '../types';

const sampleStudent: UserProfile = {
  name: 'Aman',
  regNumber: '12500000',
  residence: 'Hostel',
  course: 'B.Tech',
  arrivalDate: '2026-08-01T00:00:00.000Z',
  isGuest: false,
};

const guestStudent: UserProfile = {
  name: 'Guest',
  regNumber: '00000000',
  residence: 'Hostel',
  course: 'B.Tech',
  arrivalDate: '2026-08-01T00:00:00.000Z',
  isGuest: true,
};

test('shouldPersistSession never persists guest sessions and honors rememberMe', () => {
  assert.equal(shouldPersistSession(guestStudent, true), false);
  assert.equal(shouldPersistSession(guestStudent, false), false);
  assert.equal(shouldPersistSession(sampleStudent, false), false);
  assert.equal(shouldPersistSession(sampleStudent, true), true);
});

test('shouldRestoreSession starts fresh on login unless non-guest user opted into rememberMe', () => {
  assert.equal(shouldRestoreSession(null), false);
  assert.equal(shouldRestoreSession(undefined), false);
  assert.equal(shouldRestoreSession({ user: guestStudent, setupDone: true, rememberMe: true }), false);
  assert.equal(shouldRestoreSession({ user: sampleStudent, setupDone: true, rememberMe: false }), false);
  assert.equal(shouldRestoreSession({ user: sampleStudent, setupDone: true }), false);
  assert.equal(shouldRestoreSession({ user: sampleStudent, setupDone: true, rememberMe: true }), true);
});

test('resolveAppStage routes new students directly to login -> setup -> main', () => {
  assert.equal(
    resolveAppStage({ isLoading: true, isAuthenticated: false, hasCompletedSetup: false }),
    'loading'
  );
  assert.equal(
    resolveAppStage({ isLoading: false, isAuthenticated: false, hasCompletedSetup: false }),
    'login'
  );
  assert.equal(
    resolveAppStage({ isLoading: false, isAuthenticated: true, hasCompletedSetup: false }),
    'setup'
  );
  assert.equal(
    resolveAppStage({ isLoading: false, isAuthenticated: true, hasCompletedSetup: true }),
    'main'
  );
});
