export interface DailyPrompt {
  day: number;
  question: string;
  subtext: string;
}

export const REFLECTION_PROMPTS: Record<number, DailyPrompt> = {
  1: {
    day: 1,
    question: "First Day Impressions",
    subtext: "What surprised or intimidated you the most about campus today?",
  },
  2: {
    day: 2,
    question: "Finding Your Way",
    subtext: "How did finding your classroom block or timetable go?",
  },
  3: {
    day: 3,
    question: "New Faces & Friends",
    subtext: "Did you meet a roommate, classmate, or senior who made you smile?",
  },
  4: {
    day: 4,
    question: "Hostel & Food Routine",
    subtext: "How are you adjusting to the mess meals and morning rush?",
  },
  5: {
    day: 5,
    question: "First Week Victory",
    subtext: "What is one hurdle you handled completely on your own this week?",
  },
  6: {
    day: 6,
    question: "Feelings & Homesickness",
    subtext: "Are you feeling homesick, excited, or finding a balance?",
  },
  7: {
    day: 7,
    question: "Weekend Breath",
    subtext: "What was your favorite moment or discovery from week 1?",
  },
  8: {
    day: 8,
    question: "Passions & Clubs",
    subtext: "Which student club or activity caught your eye at DSW?",
  },
  9: {
    day: 9,
    question: "Academics & Labs",
    subtext: "How did your first week of professors and practicals feel?",
  },
  10: {
    day: 10,
    question: "Campus Life Hack",
    subtext: "What is one useful tip or shortcut you've discovered by now?",
  },
  11: {
    day: 11,
    question: "Goals for Semester 1",
    subtext: "What are you most excited to learn or achieve this term?",
  },
  12: {
    day: 12,
    question: "Senior Guidance",
    subtext: "What was the most helpful piece of advice someone gave you?",
  },
  13: {
    day: 13,
    question: "Growing Independent",
    subtext: "How does managing your own time and laundry feel now?",
  },
  14: {
    day: 14,
    question: "Campus Gratitude",
    subtext: "Who is one person who made your orientation days easier?",
  },
  15: {
    day: 15,
    question: "15-Day Milestone",
    subtext: "You survived the first two weeks! How have you changed since Day 1?",
  },
};

export const MOOD_OPTIONS: { type: 'happy' | 'calm' | 'overwhelmed' | 'tired' | 'confident'; label: string; emoji: string; color: string }[] = [
  { type: 'happy', label: 'Excited', emoji: '😊', color: '#F59E0B' },
  { type: 'calm', label: 'At Peace', emoji: '😌', color: '#10B981' },
  { type: 'overwhelmed', label: 'Anxious', emoji: '🤔', color: '#8B5CF6' },
  { type: 'tired', label: 'Exhausted', emoji: '😴', color: '#6B7280' },
  { type: 'confident', label: 'Confident', emoji: '💪', color: '#F57C00' },
];
