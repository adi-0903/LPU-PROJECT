import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, ChatMessage, ReflectionEntry } from '../types';
import { INITIAL_TASKS } from '../data/tasks';
import { calculateCurrentDay, calculateProgress } from '../utils/dayUtils';
import { upsertReflection, deleteReflection } from '../utils/reflectionUtils';
import { useAuth } from './AuthContext';

const COMPLETED_TASKS_KEY = '@app_completed_tasks';
const OVERRIDE_DAY_KEY = '@app_override_day';
const REMINDERS_KEY = '@app_event_reminders';
const CHAT_MESSAGES_KEY = '@app_chat_messages';
const REFLECTIONS_KEY = '@app_daily_reflections';

interface AppContextType {
  tasks: Task[];
  completedTaskIds: string[];
  currentDay: number;
  overallProgress: { total: number; completed: number; percentage: number };
  dayProgress: { total: number; completed: number; percentage: number };
  eventReminders: string[];
  chatMessages: ChatMessage[];
  reflections: ReflectionEntry[];
  toggleTaskCompletion: (taskId: string) => void;
  setDemoDay: (day: number) => void;
  toggleEventReminder: (eventId: string) => void;
  sendChatMessage: (text: string) => void;
  saveReflection: (entry: ReflectionEntry) => Promise<void>;
  deleteReflectionEntry: (day: number) => Promise<void>;
  resetDemoData: () => Promise<void>;
  isHostel: boolean;
}

const AppContext = createContext<AppContextType>({
  tasks: INITIAL_TASKS,
  completedTaskIds: [],
  currentDay: 1,
  overallProgress: { total: 0, completed: 0, percentage: 0 },
  dayProgress: { total: 0, completed: 0, percentage: 0 },
  eventReminders: [],
  chatMessages: [],
  reflections: [],
  toggleTaskCompletion: () => {},
  setDemoDay: () => {},
  toggleEventReminder: () => {},
  sendChatMessage: () => {},
  saveReflection: async () => {},
  deleteReflectionEntry: async () => {},
  resetDemoData: async () => {},
  isHostel: true,
});

const DEFAULT_CHAT: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'senior',
    text: "Hey! Welcome to LPU! I'm Rohan from 3rd year CSE. Don't worry at all—we all felt a bit overwhelmed the first week. What can I help you with today?",
    timestamp: 'Just now',
  },
];

const DEFAULT_REFLECTIONS: ReflectionEntry[] = [
  {
    id: 'ref-d1',
    day: 1,
    date: 'Day 1',
    mood: 'happy',
    prompt: 'First Day Impressions',
    text: 'Moved into BH-4 today! Met my roommate Arjun and got my hostel keys. Campus is huge but seniors were really friendly when I asked for directions.',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks] = useState<Task[]>(INITIAL_TASKS);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [overrideDay, setOverrideDay] = useState<number | null>(null);
  const [eventReminders, setEventReminders] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(DEFAULT_CHAT);
  const [reflections, setReflections] = useState<ReflectionEntry[]>(DEFAULT_REFLECTIONS);

  const isHostel = useMemo(() => {
    return user ? user.residence === 'Hostel' : true;
  }, [user]);

  // Load persisted app state
  useEffect(() => {
    const loadState = async () => {
      try {
        const [savedTasks, savedDay, savedReminders, savedChat, savedReflections] = await Promise.all([
          AsyncStorage.getItem(COMPLETED_TASKS_KEY),
          AsyncStorage.getItem(OVERRIDE_DAY_KEY),
          AsyncStorage.getItem(REMINDERS_KEY),
          AsyncStorage.getItem(CHAT_MESSAGES_KEY),
          AsyncStorage.getItem(REFLECTIONS_KEY),
        ]);

        if (savedTasks) {
          setCompletedTaskIds(JSON.parse(savedTasks));
        } else {
          // Pre-check 1 sample task for nice initial progress
          setCompletedTaskIds(['d1-t1']);
        }

        if (savedDay) {
          const parsedDay = parseInt(savedDay, 10);
          if (!isNaN(parsedDay) && parsedDay >= 1 && parsedDay <= 15) {
            setOverrideDay(parsedDay);
          }
        }

        if (savedReminders) {
          setEventReminders(JSON.parse(savedReminders));
        }

        if (savedChat) {
          setChatMessages(JSON.parse(savedChat));
        }

        if (savedReflections) {
          setReflections(JSON.parse(savedReflections));
        }
      } catch (err) {
        console.error('Failed to load AppContext state', err);
      }
    };

    loadState();
  }, []);

  const currentDay = useMemo(() => {
    return calculateCurrentDay(user?.arrivalDate, overrideDay ?? undefined);
  }, [user?.arrivalDate, overrideDay]);

  // Filter tasks based on hostel/day-scholar
  const relevantTasks = useMemo(() => {
    return tasks.filter(t => !t.hostelOnly || isHostel);
  }, [tasks, isHostel]);

  const overallProgress = useMemo(() => {
    return calculateProgress(relevantTasks, completedTaskIds);
  }, [relevantTasks, completedTaskIds]);

  const dayProgress = useMemo(() => {
    return calculateProgress(relevantTasks, completedTaskIds, currentDay);
  }, [relevantTasks, completedTaskIds, currentDay]);

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTaskIds(prev => {
      const exists = prev.includes(taskId);
      const updated = exists ? prev.filter(id => id !== taskId) : [...prev, taskId];
      AsyncStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  const setDemoDay = (day: number) => {
    const clamped = Math.max(1, Math.min(15, day));
    setOverrideDay(clamped);
    AsyncStorage.setItem(OVERRIDE_DAY_KEY, clamped.toString()).catch(() => {});
  };

  const toggleEventReminder = (eventId: string) => {
    setEventReminders(prev => {
      const exists = prev.includes(eventId);
      const updated = exists ? prev.filter(id => id !== eventId) : [...prev, eventId];
      AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Now',
    };

    const newChatList = [...chatMessages, userMsg];
    setChatMessages(newChatList);
    AsyncStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(newChatList)).catch(() => {});

    // Generate intelligent senior response
    setTimeout(() => {
      let reply = "Got it! Feel free to drop by BH-4 room 312 anytime if you need more help or want to borrow notes.";
      const lower = text.toLowerCase();
      if (lower.includes('block 32') || lower.includes('id card') || lower.includes('registration')) {
        reply = "For Block 32 and ID card, go right after lunch around 2 PM. Counter 4 is the fastest. Keep your admission printout ready!";
      } else if (lower.includes('attendance') || lower.includes('75%') || lower.includes('medical')) {
        reply = "Yes, 75% is strict! Even 74.9% will flag debarred in UMS. If sick, get the hospital OPD slip stamped within 3 days without fail.";
      } else if (lower.includes('cycle') || lower.includes('bicycle')) {
        reply = "Check the senior WhatsApp group or Uni-Mall basement notice board. You can easily find a gearless Hero cycle for ₹1,500 - ₹2,000.";
      } else if (lower.includes('mess') || lower.includes('food')) {
        reply = "Uni-Mall 2nd floor has great dosa and rolls. Also, the south Indian counter in Central Food Court has amazing fresh filter coffee!";
      } else if (lower.includes('code') || lower.includes('coding') || lower.includes('cse')) {
        reply = "Start with C++ or Python on LeetCode. Our GDSC club runs weekly fresher workshops in Block 38 every Tuesday evening!";
      }

      const seniorMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'senior',
        text: reply,
        timestamp: 'Just now',
      };

      setChatMessages(current => {
        const withReply = [...current, seniorMsg];
        AsyncStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(withReply)).catch(() => {});
        return withReply;
      });
    }, 800);
  };

  const saveReflection = async (entry: ReflectionEntry) => {
    setReflections((prev) => {
      const updated = upsertReflection(prev, entry);
      AsyncStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  const deleteReflectionEntry = async (day: number) => {
    setReflections((prev) => {
      const updated = deleteReflection(prev, day);
      AsyncStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  const resetDemoData = async () => {
    const defaultTasks = ['d1-t1'];
    setCompletedTaskIds(defaultTasks);
    setOverrideDay(1);
    setEventReminders([]);
    setChatMessages(DEFAULT_CHAT);
    setReflections(DEFAULT_REFLECTIONS);

    await Promise.all([
      AsyncStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(defaultTasks)),
      AsyncStorage.setItem(OVERRIDE_DAY_KEY, '1'),
      AsyncStorage.removeItem(REMINDERS_KEY),
      AsyncStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(DEFAULT_CHAT)),
      AsyncStorage.setItem(REFLECTIONS_KEY, JSON.stringify(DEFAULT_REFLECTIONS)),
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        tasks: relevantTasks,
        completedTaskIds,
        currentDay,
        overallProgress,
        dayProgress,
        eventReminders,
        chatMessages,
        reflections,
        toggleTaskCompletion,
        setDemoDay,
        toggleEventReminder,
        sendChatMessage,
        saveReflection,
        deleteReflectionEntry,
        resetDemoData,
        isHostel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
