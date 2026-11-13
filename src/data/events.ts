import { CampusEvent } from '../types';

export const CAMPUS_EVENTS: CampusEvent[] = [
  {
    id: 'ev-1',
    title: 'University Induction & Chancellor Address',
    date: 'Friday, 10:00 AM',
    time: '10:00 AM - 12:30 PM',
    venue: 'Baldev Raj Mittal Auditorium (Block 32)',
    description: 'Formal welcome address, unveiling of academic goals, scholarship announcements, and guidance from university deans.',
    category: 'Orientation',
  },
  {
    id: 'ev-2',
    title: 'DSW Clubs & Societies Mega Expo',
    date: 'Saturday, 2:00 PM',
    time: '2:00 PM - 6:00 PM',
    venue: 'Central Lawns (Opposite Block 30)',
    description: 'Explore over 50+ student-led technical, dance, robotics, literary, drama, and sports societies with live demonstrations.',
    category: 'Student Life',
  },
  {
    id: 'ev-3',
    title: 'Digital Library & Research Workshop',
    date: 'Monday, 4:00 PM',
    time: '4:00 PM - 5:15 PM',
    venue: 'Block 34, 2nd Floor Seminar Hall',
    description: 'Hands-on tutorial on accessing IEEE Xplore, ScienceDirect, Harvard Business Review cases, and borrowing textbooks.',
    category: 'Academic',
  },
  {
    id: 'ev-4',
    title: 'Google Developer Group & Coding Orientation',
    date: 'Tuesday, 5:30 PM',
    time: '5:30 PM - 7:00 PM',
    venue: 'Block 38 Audi-3',
    description: 'Kickstart competitive programming, GitHub repositories, and open source roadmap for first-year engineers.',
    category: 'Technical',
  },
  {
    id: 'ev-5',
    title: 'Freshers Acoustic Night & Cultural Jam',
    date: 'Thursday, 7:00 PM',
    time: '7:00 PM - 9:30 PM',
    venue: 'Open Air Amphitheatre',
    description: 'Live musical performances by campus bands, open-mic poetry, and a welcoming relaxed vibe for new students.',
    category: 'Cultural',
  },
];
