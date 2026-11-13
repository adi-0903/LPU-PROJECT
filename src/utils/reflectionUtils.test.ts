import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateReflectionText,
  getPromptForDay,
  upsertReflection,
  deleteReflection,
  getReflectionForDay,
  calculateReflectionStats,
} from './reflectionUtils';
import { ReflectionEntry } from '../types';

test('validateReflectionText checks empty, min length, and max length', () => {
  assert.equal(validateReflectionText('').valid, false);
  assert.equal(validateReflectionText('   ').valid, false);
  assert.equal(validateReflectionText('Hi').valid, false);
  assert.equal(validateReflectionText('Had a great first day!').valid, true);
  assert.equal(validateReflectionText('a'.repeat(601)).valid, false);
  assert.equal(validateReflectionText('a'.repeat(600)).valid, true);
});

test('getPromptForDay clamps between 1 and 15 and returns relevant fresher prompt', () => {
  const day1 = getPromptForDay(1);
  assert.equal(day1.question, 'First Day Impressions');

  const day15 = getPromptForDay(15);
  assert.equal(day15.question, '15-Day Milestone');

  const day0 = getPromptForDay(0);
  assert.equal(day0.question, 'First Day Impressions');

  const day20 = getPromptForDay(20);
  assert.equal(day20.question, '15-Day Milestone');
});

test('upsertReflection adds new day entry and replaces existing day entry', () => {
  const initial: ReflectionEntry[] = [
    { id: 'r1', day: 1, date: '2026-08-01', mood: 'happy', prompt: 'P1', text: 'Day 1 entry' },
    { id: 'r3', day: 3, date: '2026-08-03', mood: 'calm', prompt: 'P3', text: 'Day 3 entry' },
  ];

  // Add Day 2
  const added = upsertReflection(initial, {
    id: 'r2',
    day: 2,
    date: '2026-08-02',
    mood: 'overwhelmed',
    prompt: 'P2',
    text: 'Day 2 entry',
  });
  assert.equal(added.length, 3);
  assert.deepEqual(added.map(e => e.day), [1, 2, 3]);

  // Update Day 1
  const updated = upsertReflection(added, {
    id: 'r1-updated',
    day: 1,
    date: '2026-08-01',
    mood: 'confident',
    prompt: 'P1',
    text: 'Updated Day 1 entry',
  });
  assert.equal(updated.length, 3);
  assert.equal(updated[0].text, 'Updated Day 1 entry');
  assert.equal(updated[0].mood, 'confident');
});

test('deleteReflection removes matching entry by day', () => {
  const entries: ReflectionEntry[] = [
    { id: 'r1', day: 1, date: '2026-08-01', mood: 'happy', prompt: 'P1', text: 'Day 1' },
    { id: 'r2', day: 2, date: '2026-08-02', mood: 'calm', prompt: 'P2', text: 'Day 2' },
  ];

  const result = deleteReflection(entries, 1);
  assert.equal(result.length, 1);
  assert.equal(result[0].day, 2);
});

test('getReflectionForDay finds entry', () => {
  const entries: ReflectionEntry[] = [
    { id: 'r1', day: 1, date: '2026-08-01', mood: 'happy', prompt: 'P1', text: 'Day 1' },
  ];
  assert.equal(getReflectionForDay(entries, 1)?.text, 'Day 1');
  assert.equal(getReflectionForDay(entries, 2), undefined);
});

test('calculateReflectionStats returns counts and dominant mood', () => {
  const entries: ReflectionEntry[] = [
    { id: 'r1', day: 1, date: '2026-08-01', mood: 'happy', prompt: 'P1', text: 'Day 1' },
    { id: 'r2', day: 2, date: '2026-08-02', mood: 'happy', prompt: 'P2', text: 'Day 2' },
    { id: 'r3', day: 5, date: '2026-08-05', mood: 'overwhelmed', prompt: 'P5', text: 'Day 5' },
  ];

  const stats = calculateReflectionStats(entries);
  assert.equal(stats.total, 3);
  assert.deepEqual(stats.daysReflected, [1, 2, 5]);
  assert.equal(stats.mostFrequentMood, 'happy');
});
