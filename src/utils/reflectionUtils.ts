import { ReflectionEntry, MoodType } from '../types';
import { REFLECTION_PROMPTS } from '../data/reflectionPrompts';

export function validateReflectionText(text: string): { valid: boolean; error?: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please write a few words to save your reflection.' };
  }
  if (trimmed.length < 5) {
    return { valid: false, error: 'Reflection is a bit too short (at least 5 characters).' };
  }
  if (trimmed.length > 600) {
    return { valid: false, error: 'Maximum 600 characters allowed.' };
  }
  return { valid: true };
}

export function getPromptForDay(day: number): { question: string; subtext: string } {
  const clampedDay = Math.max(1, Math.min(15, Math.floor(day)));
  return REFLECTION_PROMPTS[clampedDay] || {
    day: clampedDay,
    question: `Day ${clampedDay} Reflection`,
    subtext: 'How was your campus experience today?',
  };
}

export function upsertReflection(
  entries: ReflectionEntry[],
  newEntry: ReflectionEntry
): ReflectionEntry[] {
  const index = entries.findIndex((e) => e.day === newEntry.day);
  if (index >= 0) {
    const updated = [...entries];
    updated[index] = newEntry;
    return updated.sort((a, b) => a.day - b.day);
  }
  return [...entries, newEntry].sort((a, b) => a.day - b.day);
}

export function deleteReflection(
  entries: ReflectionEntry[],
  day: number
): ReflectionEntry[] {
  return entries.filter((e) => e.day !== day);
}

export function getReflectionForDay(
  entries: ReflectionEntry[],
  day: number
): ReflectionEntry | undefined {
  return entries.find((e) => e.day === day);
}

export function calculateReflectionStats(entries: ReflectionEntry[]): {
  total: number;
  daysReflected: number[];
  mostFrequentMood?: MoodType;
} {
  const total = entries.length;
  const daysReflected = entries.map((e) => e.day).sort((a, b) => a - b);

  if (total === 0) {
    return { total: 0, daysReflected: [] };
  }

  const counts: Record<string, number> = {};
  for (const entry of entries) {
    counts[entry.mood] = (counts[entry.mood] || 0) + 1;
  }

  let mostFrequentMood: MoodType | undefined;
  let maxCount = 0;
  for (const mood of Object.keys(counts) as MoodType[]) {
    if (counts[mood] > maxCount) {
      maxCount = counts[mood];
      mostFrequentMood = mood;
    }
  }

  return { total, daysReflected, mostFrequentMood };
}
