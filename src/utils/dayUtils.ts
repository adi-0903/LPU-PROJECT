import { Task } from '../types';

/**
 * Calculates current day (1 to 15) based on arrival date,
 * clamped strictly between 1 and 15.
 */
export function calculateCurrentDay(arrivalDateStr?: string, overrideDay?: number): number {
  if (typeof overrideDay === 'number' && overrideDay >= 1 && overrideDay <= 15) {
    return Math.floor(overrideDay);
  }

  if (!arrivalDateStr) {
    return 1;
  }

  try {
    const arrival = new Date(arrivalDateStr);
    const now = new Date();
    // Normalize to midnight
    const arrivalMidnight = new Date(arrival.getFullYear(), arrival.getMonth(), arrival.getDate()).getTime();
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const diffDays = Math.floor((nowMidnight - arrivalMidnight) / (1000 * 60 * 60 * 24));
    const day = diffDays + 1;

    if (day < 1) return 1;
    if (day > 15) return 15;
    return day;
  } catch {
    return 1;
  }
}

/**
 * Calculates completion percentage and counts
 */
export function calculateProgress(
  allTasks: Task[],
  completedIds: string[],
  dayFilter?: number
): { total: number; completed: number; percentage: number } {
  const filtered = typeof dayFilter === 'number'
    ? allTasks.filter(t => t.day === dayFilter)
    : allTasks;

  const total = filtered.length;
  if (total === 0) return { total: 0, completed: 0, percentage: 0 };

  const completedSet = new Set(completedIds);
  const completed = filtered.filter(t => completedSet.has(t.id)).length;
  const percentage = Math.round((completed / total) * 100);

  return { total, completed, percentage };
}

/**
 * Returns today's top 3 incomplete tasks
 */
export function getTodayTopTasks(
  allTasks: Task[],
  completedIds: string[],
  currentDay: number,
  limit: number = 3
): Task[] {
  const completedSet = new Set(completedIds);
  const dayTasks = allTasks.filter(t => t.day === currentDay);
  const incomplete = dayTasks.filter(t => !completedSet.has(t.id));

  // Prioritize high-priority tasks first, then order in data
  incomplete.sort((a, b) => {
    if (a.priority && !b.priority) return -1;
    if (!a.priority && b.priority) return 1;
    return 0;
  });

  return incomplete.slice(0, limit);
}

/**
 * Filter tasks by day, hostel status, and optional category
 */
export function filterTasks(
  allTasks: Task[],
  day: number,
  isHostel: boolean,
  category?: string
): Task[] {
  return allTasks.filter(task => {
    if (task.day !== day) return false;
    if (task.hostelOnly && !isHostel) return false;
    if (category && category !== 'All' && task.category !== category) return false;
    return true;
  });
}
