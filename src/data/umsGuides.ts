import { UmsGuide } from '../types';

export const UMS_GUIDES: UmsGuide[] = [
  {
    id: 'guide-login',
    title: 'Logging in to UMS',
    subtitle: 'Activate your digital campus credentials and dashboard',
    icon: 'log-in',
    steps: [
      {
        stepNumber: 1,
        title: 'Open Official UMS Portal',
        instruction: 'Navigate to ums.lpu.in on your phone or laptop browser, or download the "LPU Live" mobile app from Play Store/App Store.',
        hint: 'Always bookmark the authentic URL: ums.lpu.in',
      },
      {
        stepNumber: 2,
        title: 'Enter 8-digit Registration Number',
        instruction: 'Type your official 8-digit registration number found on your university admission offer letter (e.g., 12500000).',
        hint: 'Do not prefix with any letters or symbols.',
      },
      {
        stepNumber: 3,
        title: 'Enter Initial Default Password',
        instruction: 'Your default password was sent via SMS during registration (typically Fresher@123 or your Date of Birth in DDMMYYYY format).',
      },
      {
        stepNumber: 4,
        title: 'Set New Strong Password',
        instruction: 'On first login, the system will prompt you to set a 8+ character password with at least one uppercase letter and one special character.',
        hint: 'Never share your UMS credentials with other students.',
      },
    ],
  },
  {
    id: 'guide-timetable',
    title: 'Viewing Your Timetable',
    subtitle: 'Understand your weekly class schedule, sections, and room numbers',
    icon: 'calendar',
    steps: [
      {
        stepNumber: 1,
        title: 'Open the Left Navigation Sidebar',
        instruction: 'Click the menu icon (hamburger) on the top left of your UMS dashboard.',
      },
      {
        stepNumber: 2,
        title: 'Navigate to Academic Services -> Timetable',
        instruction: 'Select "Timetable" from the dropdown. You can choose "Weekly View" or "Day-wise View".',
      },
      {
        stepNumber: 3,
        title: 'Decode Course and Room Codes',
        instruction: 'Each slot shows Subject Code (e.g. CSE101), Faculty Name, and Room (e.g., 34-301 = Block 34, 3rd Floor, Room 1).',
        hint: 'Lectures with "L" are theory; slots marked "P" are practical laboratory sessions.',
      },
      {
        stepNumber: 4,
        title: 'Export / Screenshot for Offline Use',
        instruction: 'Tap the "Print / Export as PDF" button or save a screenshot on your mobile lock screen for quick hallway checks.',
      },
    ],
  },
  {
    id: 'guide-attendance',
    title: 'Checking Attendance',
    subtitle: 'Monitor your 75% percentage threshold and track missed sessions',
    icon: 'check-circle',
    steps: [
      {
        stepNumber: 1,
        title: 'Access Attendance Dashboard',
        instruction: 'On UMS home or via menu, click on "Attendance System".',
      },
      {
        stepNumber: 2,
        title: 'Inspect Overall & Subject Breakdown',
        instruction: 'Review the color-coded percentage indicators: Green indicates >= 75%, Amber is 70-74% (warning zone), and Red is below 70% (debarred).',
        hint: 'Check the "Margin" column to see how many classes you can afford to miss.',
      },
      {
        stepNumber: 3,
        title: 'Verify Daily Punch Records',
        instruction: 'Tap on any individual subject to view date-wise records (Present, Absent, Duty Leave, Medical Leave).',
      },
      {
        stepNumber: 4,
        title: 'Raise Attendance Discrepancy (if needed)',
        instruction: 'If you were present but marked absent due to biometric scanner lag, click "Report Issue" within 72 hours of the class.',
      },
    ],
  },
  {
    id: 'guide-fees',
    title: 'Paying Fees & Receipts',
    subtitle: 'Pay semester, hostel, and mess dues and retrieve tax invoices',
    icon: 'credit-card',
    steps: [
      {
        stepNumber: 1,
        title: 'Navigate to Fee Management',
        instruction: 'Select "Fee Management" -> "Fee Statement" from the navigation drawer.',
      },
      {
        stepNumber: 2,
        title: 'Review Outstanding Balance',
        instruction: 'Inspect line items for Tuition Fee, Examination Fee, Hostel Fee, and Security Deposit adjustments.',
      },
      {
        stepNumber: 3,
        title: 'Choose Payment Gateway',
        instruction: 'Click "Pay Online" and select your preferred method: UPI, Debit/Credit Card, or Net Banking.',
        hint: 'UPI transactions have zero processing fees.',
      },
      {
        stepNumber: 4,
        title: 'Download Formal Fee Receipt',
        instruction: 'Once transaction displays "Success", switch to "Payment History" and click the download icon to save your stamped PDF receipt.',
      },
    ],
  },
];
