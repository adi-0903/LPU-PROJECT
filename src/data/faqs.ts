import { FAQItem } from '../types';

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Timetable',
    question: 'How do I read my timetable and room codes like "34-402"?',
    answer: 'Classroom codes follow the format [Block Number] - [Floor & Room]. For instance, "34-402" means Block 34, 4th Floor, Room 02. "38-G05" means Block 38, Ground Floor, Room 05. Check UMS -> Timetable every Sunday night for any room shifts.',
  },
  {
    id: 'faq-2',
    category: 'Fees',
    question: 'How do I pay semester fees or download fee clearance receipts?',
    answer: 'Log in to UMS -> Fee Management -> Fee Status. You can pay via Net Banking, Debit Card, or UPI with zero gateway fees. Once completed, your automated fee receipt is generated instantly as a downloadable PDF.',
  },
  {
    id: 'faq-3',
    category: 'ID Card',
    question: 'What should I do if I haven\'t received my student ID card or lose it?',
    answer: 'Visit Block 30 (Division of Student Welfare) Counter 4 with your admission slip and biometric confirmation receipt. For lost cards, report to the security desk, pay a nominal reissuance fee on UMS, and collect your replacement within 24 hours.',
  },
  {
    id: 'faq-4',
    category: 'Hostel',
    question: 'What are the hostel curfew hours and biometric attendance rules?',
    answer: 'Hostel biometric attendance is taken between 7:30 PM and 8:30 PM every night. Students must be inside their respective hostels before the cutoff. For late library study or campus fests, request an Extended Study Slip through your hostel warden.',
  },
  {
    id: 'faq-5',
    category: 'Attendance',
    question: 'What is the mandatory 75% attendance rule and does medical leave count?',
    answer: 'LPU strictly enforces a minimum 75% overall attendance in each course to be eligible for end-term examinations. If you fall sick, submit a medical certificate endorsed by the campus Shanti Devi Mittal Hospital within 3 working days on UMS to claim duty/medical attendance.',
  },
  {
    id: 'faq-6',
    category: 'General',
    question: 'How do I reset my UMS student portal password if locked out?',
    answer: 'On the UMS login screen, click "Forgot Password". An OTP will be dispatched to your registered mobile number and personal email. If your phone number has changed, visit Block 32 Ground Floor IT helpdesk with your original ID.',
  },
  {
    id: 'faq-7',
    category: 'General',
    question: 'How do I register my laptop and phone for campus Wi-Fi?',
    answer: 'Connect to "LPU-WiFi" and open browser to wifi.lpu.in. Enter your student registration number and network password. Each student is allocated high-speed quota for up to two MAC-registered personal devices.',
  },
  {
    id: 'faq-8',
    category: 'Hostel',
    question: 'How do hostel laundry tokens and room cleaning work?',
    answer: 'Each hostel floor has designated laundry bins. You are entitled to 40 washes per semester included in standard hostel packages. Room sweepers visit daily between 10:00 AM and 1:00 PM; ensure your valuables are locked in your personal wardrobe.',
  },
];
