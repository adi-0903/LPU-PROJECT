import { SeniorMentor } from '../types';

export const SENIOR_MENTORS: SeniorMentor[] = [
  {
    id: 'm-1',
    name: 'Rohan Sharma',
    course: 'B.Tech Computer Science',
    year: '3rd Year (Junior)',
    hostel: 'BH-4 (Boys Hostel 4)',
    room: 'Room 312',
    availability: 'Evenings 6:00 PM - 9:00 PM',
    bio: 'Vice Lead at Google Developer Student Clubs LPU. Passionate about helping freshers navigate coding clubs, hostel life, and cracking hackathons.',
    specialty: 'Academics, Tech Clubs & Hostel Norms',
    phone: '+91 98721 00412',
  },
  {
    id: 'm-2',
    name: 'Priya Mehra',
    course: 'BBA & Finance',
    year: 'Final Year (Senior)',
    hostel: 'GH-2 (Girls Hostel 2)',
    room: 'Room 204',
    availability: 'Daily 4:00 PM - 7:00 PM',
    bio: 'Secretary at Student Welfare Council. Loves mentoring freshers through campus paperwork, banking setup, and discovering peaceful campus spots.',
    specialty: 'Administrative Processes, Campus Life & Banking',
    phone: '+91 98725 33219',
  },
  {
    id: 'm-3',
    name: 'Harpreet Singh',
    course: 'BCA (Cloud Computing)',
    year: '2nd Year (Sophomore)',
    hostel: 'BH-2 (Boys Hostel 2)',
    room: 'Room 118',
    availability: 'Weekends & Post-Dinner',
    bio: 'LPU native and football captain. Reach out for gym guidance, sports facilities, local food spots in Phagwara, and bicycle maintenance.',
    specialty: 'Sports, Shuttles & Off-Campus Travel',
    phone: '+91 98141 89201',
  },
];

export interface FellowFresher {
  id: string;
  name: string;
  hostel: string;
  room: string;
  hometown: string;
  course: string;
  status: string;
}

export const FELLOW_FRESHERS: FellowFresher[] = [
  { id: 'f-1', name: 'Kavya Nair', hostel: 'GH-2', room: '215', hometown: 'Kochi, Kerala', course: 'B.Tech CSE', status: 'Online' },
  { id: 'f-2', name: 'Tanmay Joshi', hostel: 'BH-4', room: '310', hometown: 'Pune, Maharashtra', course: 'B.Tech IT', status: 'In Library' },
  { id: 'f-3', name: 'Arjun Das', hostel: 'BH-4', room: '308', hometown: 'Kolkata, WB', course: 'BCA', status: 'In Mess' },
  { id: 'f-4', name: 'Simran Kaur', hostel: 'GH-2', room: '109', hometown: 'Amritsar, Punjab', course: 'BBA', status: 'Studying' },
  { id: 'f-5', name: 'Mohit Verma', hostel: 'BH-1', room: '402', hometown: 'Delhi NCR', course: 'MBA', status: 'Online' },
  { id: 'f-6', name: 'Sneha Patel', hostel: 'GH-1', room: '305', hometown: 'Ahmedabad, Gujarat', course: 'B.Tech AI', status: 'At Gym' },
];

export const PRESET_CHAT_REPLIES = [
  "Hi bhaiya! How do I get to Block 32 for my student ID?",
  "Is the 75% attendance rule really that strict?",
  "Where can I buy a cheap second-hand bicycle?",
  "Which mess food court is the best on campus?",
  "Can you review my first-year coding schedule?",
];
