import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCurrentDay, calculateProgress, getTodayTopTasks, filterTasks } from './dayUtils';
import { Task } from '../types';

test('calculateCurrentDay handles override day cleanly', () => {
  assert.equal(calculateCurrentDay('2026-08-01', 5), 5);
  assert.equal(calculateCurrentDay('2026-08-01', 1), 1);
  assert.equal(calculateCurrentDay('2026-08-01', 15), 15);
});

test('calculateCurrentDay clamps invalid override numbers', () => {
  assert.equal(calculateCurrentDay(undefined, 20), 1); // fallback
  assert.equal(calculateCurrentDay(undefined, -2), 1);
});

test('calculateProgress returns accurate percentage and count', () => {
  const mockTasks: Task[] = [
    { id: '1', day: 1, title: 'Task 1', description: 'Desc', category: 'Campus' },
    { id: '2', day: 1, title: 'Task 2', description: 'Desc', category: 'Hostel' },
    { id: '3', day: 2, title: 'Task 3', description: 'Desc', category: 'Academics' },
    { id: '4', day: 2, title: 'Task 4', description: 'Desc', category: 'Social' },
  ];

  const overall = calculateProgress(mockTasks, ['1', '2']);
  assert.equal(overall.total, 4);
  assert.equal(overall.completed, 2);
  assert.equal(overall.percentage, 50);

  const day1Progress = calculateProgress(mockTasks, ['1', '2'], 1);
  assert.equal(day1Progress.total, 2);
  assert.equal(day1Progress.completed, 2);
  assert.equal(day1Progress.percentage, 100);

  const day2Progress = calculateProgress(mockTasks, ['1', '2'], 2);
  assert.equal(day2Progress.total, 2);
  assert.equal(day2Progress.completed, 0);
  assert.equal(day2Progress.percentage, 0);
});

test('getTodayTopTasks returns first 3 incomplete tasks for given day', () => {
  const mockTasks: Task[] = [
    { id: 't1', day: 1, title: 'Task 1', description: 'Desc', category: 'Campus' },
    { id: 't2', day: 1, title: 'Task 2', description: 'Desc', category: 'Academics', priority: true },
    { id: 't3', day: 1, title: 'Task 3', description: 'Desc', category: 'Social' },
    { id: 't4', day: 1, title: 'Task 4', description: 'Desc', category: 'Hostel' },
    { id: 't5', day: 2, title: 'Task 5', description: 'Desc', category: 'Campus' },
  ];

  // t2 is completed
  const top = getTodayTopTasks(mockTasks, ['t2'], 1, 3);
  assert.equal(top.length, 3);
  assert.equal(top.map(t => t.id).includes('t2'), false);
  assert.deepEqual(top.map(t => t.id), ['t1', 't3', 't4']);
});

test('filterTasks properly respects hostelOnly flag and categories', () => {
  const mockTasks: Task[] = [
    { id: 't1', day: 1, title: 'Task 1', description: 'Desc', category: 'Campus' },
    { id: 't2', day: 1, title: 'Task 2', description: 'Desc', category: 'Hostel', hostelOnly: true },
    { id: 't3', day: 1, title: 'Task 3', description: 'Desc', category: 'Hostel' },
  ];

  const dayScholarTasks = filterTasks(mockTasks, 1, false);
  assert.equal(dayScholarTasks.length, 2);
  assert.equal(dayScholarTasks.some(t => t.id === 't2'), false);

  const hostelTasks = filterTasks(mockTasks, 1, true);
  assert.equal(hostelTasks.length, 3);

  const hostelCategoryOnly = filterTasks(mockTasks, 1, true, 'Hostel');
  assert.equal(hostelCategoryOnly.length, 2);
});
