export type ResidenceType = 'Hostel' | 'Day scholar';

export type CourseType = 'B.Tech' | 'BCA' | 'BBA' | 'MBA' | 'Other';

export interface UserProfile {
  name: string;
  regNumber: string;
  mobile?: string;
  residence: ResidenceType;
  course: CourseType;
  arrivalDate: string; // ISO date string
  isGuest?: boolean;
}

export type TaskCategory = 'Academics' | 'Hostel' | 'Banking & SIM' | 'Campus' | 'Social';

export interface Task {
  id: string;
  day: number; // 1 to 15
  title: string;
  description: string;
  category: TaskCategory;
  hostelOnly?: boolean;
  location?: string;
  tips?: string;
  priority?: boolean;
}

export interface Place {
  id: string;
  name: string;
  block: string;
  category:
    | 'Admin'
    | 'Library'
    | 'Hostel Office'
    | 'Help Desk'
    | 'Medical Centre'
    | 'Bank/ATM'
    | 'Mess/Food Court'
    | 'Academic'
    | 'Hostels'
    | 'Sports & Gates'
    | string;
  shortDescription: string;
  directions: string;
  timings: string;
  contact?: string;
  landmark: string;
  iconName: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Timetable' | 'Fees' | 'ID Card' | 'Hostel' | 'Attendance' | 'General';
}

export interface UmsGuideStep {
  stepNumber: number;
  title: string;
  instruction: string;
  hint?: string;
}

export interface UmsGuide {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  steps: UmsGuideStep[];
}

export interface SeniorMentor {
  id: string;
  name: string;
  course: string;
  year: string;
  hostel: string;
  room?: string;
  availability: string;
  bio: string;
  specialty: string;
  avatarUrl?: string;
  phone?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  category: string;
}

export interface TipOfTheDay {
  day: number;
  title: string;
  tip: string;
  author: string;
}

export interface ChatMessage {
  id: string;
  sender: 'senior' | 'user';
  text: string;
  timestamp: string;
}

export type MoodType = 'happy' | 'calm' | 'overwhelmed' | 'tired' | 'confident';

export interface ReflectionEntry {
  id: string;
  day: number; // 1 to 15
  date: string;
  mood: MoodType;
  prompt: string;
  text: string;
  tags?: string[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type BlockCategory =
  | 'Academic Blocks'
  | 'Hostels'
  | 'Food & Dining'
  | 'Admin & Help'
  | 'Medical & Banks'
  | 'Sports & Gates';

export interface CampusBlock {
  id: string;
  name: string;
  blockNumber: string;
  category: BlockCategory;
  coordinates: Coordinates;
  description: string;
  facilities: string[];
  entranceLocation?: string;
  floors?: string;
  icon: string;
}

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
  landmark?: string;
}

export interface NavigationRoute {
  origin: CampusBlock;
  destination: CampusBlock;
  pathCoordinates: Coordinates[];
  totalDistanceMeters: number;
  walkMinutes: number;
  cycleMinutes: number;
  steps: RouteStep[];
}

export type EmergencyCategory = 'Security' | 'Medical' | 'Hostel' | 'Helpline';

export interface EmergencyContact {
  id: string;
  title: string;
  subtitle: string;
  phoneNumber: string;
  alternateNumber?: string;
  category: EmergencyCategory;
  availableHours: string;
  location: string;
  icon: string;
  isHotline?: boolean;
  priorityOrder: number;
}
