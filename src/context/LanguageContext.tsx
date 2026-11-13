import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'hi';

const STORAGE_KEY = '@app_language';

export const TRANSLATIONS = {
  en: {
    appName: 'First 15 Days',
    appTagline: "Let's make your first 15 days easy.",
    welcome: 'Welcome!',
    login: 'Log in',
    signUp: 'Create account',
    newHere: 'New here?',
    continueAsGuest: 'Continue as guest',
    keepMeSignedIn: 'Keep me signed in on this device',
    newStudentCta: 'New to LPU? Create student account',
    step1Of2: 'Step 1 of 2 · Student Account',
    step2Of2: 'Step 2 of 2 · Campus Preferences',
    demoAccount: 'Demo Account',
    fillDemo: 'Fill Demo (12500000 / Fresher@123)',
    forgotPassword: 'Forgot password?',
    forgotPasswordTitle: 'Forgot Password?',
    forgotPasswordMsg: 'In this prototype, use the LPU demo credentials (Reg: 12500000, Pass: Fresher@123) or continue as guest.',
    regNumber: 'Registration number',
    regPlaceholder: '8-digit registration no.',
    password: 'Password',
    passwordPlaceholder: 'At least 6 characters',
    confirmPassword: 'Confirm password',
    fullName: 'Full name',
    fullNamePlaceholder: 'e.g. Aman Sharma',
    mobileNumber: 'Mobile number',
    mobilePlaceholder: '10-digit mobile number',
    alreadyHaveAccount: 'Already have an account? Log in',
    wrongCredentials: 'Wrong registration number or password. Try again.',
    setupTitle: 'Welcome to Campus!',
    setupSubtitle: 'Personalize your onboarding guide in 3 quick questions.',
    residenceType: 'Where are you staying?',
    hostel: 'Hostel',
    dayScholar: 'Day scholar',
    courseSelect: 'Select your course',
    arrivalDate: 'When did you arrive on campus?',
    startMy15Days: 'Start my 15 days',
    hi: 'Hi',
    todayTopTasks: "Today's top 3 tasks",
    imLost: 'Campus Info & Help',
    emergencyContacts: 'Emergency Contacts',
    campusSecurity: 'Campus Security',
    ambulanceServices: 'Ambulance Services',
    wardenDesk: 'Warden Contact Details',
    tipOfTheDay: 'Tip of the day',
    upcomingThisWeek: 'Upcoming this week',
    day: 'Day',
    of15: 'of 15',
    allDone: 'All caught up!',
    viewAllChecklist: 'View full checklist',
    home: 'Home',
    checklist: 'Checklist',
    help: 'Campus Info',
    buddy: 'Buddy',
    profile: 'Profile',
    searchPlacesFaqs: 'Search blocks, gates, ATMs, FAQs...',
    howToReach: 'How to reach',
    openMap: 'Open campus map',
    askSenior: 'Ask a senior',
    faqs: 'Frequently Asked Questions',
    umsGuide: 'UMS Step-by-Step Guide',
    viewUmsGuide: 'View UMS Guide',
    seniorMentor: 'Your Senior Mentor',
    fellowFreshers: 'Fellow freshers in your hostel',
    campusEvents: "This week's orientation events",
    addReminder: 'Add reminder',
    reminderSet: 'Reminder set',
    messageSenior: 'Message',
    chatPlaceholder: 'Ask a question or select a preset below...',
    send: 'Send',
    demoSetDay: 'Demo: Set Current Day (1 to 15)',
    resetDemoData: 'Reset demo data',
    logout: 'Log out',
    resetConfirmTitle: 'Reset Demo Data',
    resetConfirmMsg: 'All checklist progress and custom settings will be restored to defaults.',
    resetSuccess: 'Data reset successfully!',
    hostelOnlyBadge: 'Hostel Only',
    priorityBadge: 'Important',
    completed: 'completed',
    allTasks: 'All',
    academics: 'Academics',
    bankingSim: 'Banking & SIM',
    campus: 'Campus',
    social: 'Social',
    noTasksFound: 'No tasks found for this filter.',
    close: 'Close',
    back: 'Back',
    cancel: 'Cancel',
    confirm: 'Confirm',
    step: 'Step',
    reflectionsTitle: 'Daily Reflections Journal',
    reflectionsSub: 'Process your thoughts & emotions across your first 15 days',
    writeReflection: 'Write Reflection',
    saveEntry: 'Save Reflection',
    savedSuccess: 'Reflection saved successfully!',
    deleteEntry: 'Delete',
    deletedSuccess: 'Entry deleted',
    selectMood: 'How are you feeling today?',
    journalPlaceholder: 'Write about your experiences, challenges, or thoughts today...',
    entriesCount: 'reflections recorded',
    dayPrompt: 'Daily Prompt',
  },
  hi: {
    appName: 'फर्स्ट 15 डेज़',
    appTagline: 'आइए आपके पहले 15 दिनों को आसान बनाएं।',
    welcome: 'नमस्ते!',
    login: 'लॉग इन करें',
    signUp: 'नया खाता बनाएं',
    newHere: 'नए छात्र हैं?',
    continueAsGuest: 'गेस्ट के रूप में जारी रखें',
    keepMeSignedIn: 'इस डिवाइस पर साइन-इन रखें',
    newStudentCta: 'LPU में नए हैं? नया छात्र खाता बनाएं',
    step1Of2: 'चरण 1 / 2 · छात्र पंजीकरण',
    step2Of2: 'चरण 2 / 2 · कैंपस सेटअप',
    demoAccount: 'डेमो अकाउंट',
    fillDemo: 'डेमो भरें (12500000 / Fresher@123)',
    forgotPassword: 'पासवर्ड भूल गए?',
    forgotPasswordTitle: 'पासवर्ड भूल गए?',
    forgotPasswordMsg: 'इस प्रोटोटाइप में LPU डेमो क्रेडेंशियल्स का उपयोग करें (पंजीकरण: 12500000, पासवर्ड: Fresher@123) या गेस्ट के रूप में जारी रखें।',
    regNumber: 'पंजीकरण संख्या',
    regPlaceholder: '8 अंकों का पंजीकरण नंबर',
    password: 'पासवर्ड',
    passwordPlaceholder: 'कम से कम 6 अक्षर',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    fullName: 'पूरा नाम',
    fullNamePlaceholder: 'उदा. अमन शर्मा',
    mobileNumber: 'मोबाइल नंबर',
    mobilePlaceholder: '10 अंकों का मोबाइल नंबर',
    alreadyHaveAccount: 'पहले से खाता है? लॉग इन करें',
    wrongCredentials: 'गलत पंजीकरण संख्या या पासवर्ड। पुनः प्रयास करें।',
    setupTitle: 'कैंपस में आपका स्वागत है!',
    setupSubtitle: '3 आसान सवालों के साथ अपने सफर को शुरू करें।',
    residenceType: 'आप कहाँ रह रहे हैं?',
    hostel: 'हॉस्टल',
    dayScholar: 'डे स्कॉलर',
    courseSelect: 'अपना कोर्स चुनें',
    arrivalDate: 'आप कैंपस कब पहुंचे?',
    startMy15Days: 'मेरे 15 दिन शुरू करें',
    hi: 'नमस्ते',
    todayTopTasks: 'आज के शीर्ष 3 कार्य',
    imLost: 'कैंपस जानकारी व मदद',
    emergencyContacts: 'आपातकालीन संपर्क (Emergency Contacts)',
    campusSecurity: 'कैंपस सुरक्षा (Security)',
    ambulanceServices: 'एम्बुलेंस व चिकित्सा सेवा',
    wardenDesk: 'हॉस्टल वार्डन संपर्क',
    tipOfTheDay: 'आज का सुझाव',
    upcomingThisWeek: 'इस सप्ताह के कार्यक्रम',
    day: 'दिन',
    of15: 'में से 15',
    allDone: 'सब पूरा हो गया!',
    viewAllChecklist: 'पूरी चेकलिस्ट देखें',
    home: 'होम',
    checklist: 'चेकलिस्ट',
    help: 'कैंपस जानकारी',
    buddy: 'सीनियर बडी',
    profile: 'प्रोफ़ाइल',
    searchPlacesFaqs: 'ब्लॉक, गेट, एटीएम, सवाल खोजें...',
    howToReach: 'कैसे पहुँचें',
    openMap: 'कैंपस मैप खोलें',
    askSenior: 'सीनियर से पूछें',
    faqs: 'अक्सर पूछे जाने वाले प्रश्न',
    umsGuide: 'यूएमएस गाइड (कदम दर कदम)',
    viewUmsGuide: 'यूएमएस गाइड देखें',
    seniorMentor: 'आपके सीनियर मेंटर',
    fellowFreshers: 'आपके हॉस्टल के साथी फ्रेशर्स',
    campusEvents: 'इस सप्ताह के ओरिएंटेशन इवेंट्स',
    addReminder: 'रिमाइंडर जोड़ें',
    reminderSet: 'रिमाइंडर सेट है',
    messageSenior: 'संदेश भेजें',
    chatPlaceholder: 'सवाल पूछें या नीचे दिया विकल्प चुनें...',
    send: 'भेजें',
    demoSetDay: 'डेमो: वर्तमान दिन चुनें (1 से 15)',
    resetDemoData: 'डेमो डेटा रीसेट करें',
    logout: 'लॉग आउट',
    resetConfirmTitle: 'डेटा रीसेट करें',
    resetConfirmMsg: 'सभी चेकलिस्ट प्रगति और सेटिंग्स डिफ़ॉल्ट पर रीसेट हो जाएंगी।',
    resetSuccess: 'डेटा सफलतापूर्वक रीसेट हो गया!',
    hostelOnlyBadge: 'केवल हॉस्टल',
    priorityBadge: 'महत्वपूर्ण',
    completed: 'पूर्ण',
    allTasks: 'सभी',
    academics: 'अकादमिक',
    bankingSim: 'बैंकिंग व सिम',
    campus: 'कैंपस',
    social: 'सामाजिक',
    noTasksFound: 'इस फ़िल्टर के लिए कोई कार्य नहीं मिला।',
    close: 'बंद करें',
    back: 'वापस',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    step: 'कदम',
    reflectionsTitle: 'दैनिक चिंतन डायरी',
    reflectionsSub: 'अपने पहले 15 दिनों के अनुभवों और भावनाओं को समझें',
    writeReflection: 'चिंतन लिखें',
    saveEntry: 'चिंतन सहेजें',
    savedSuccess: 'चिंतन सफलतापूर्वक सहेजा गया!',
    deleteEntry: 'हटाएं',
    deletedSuccess: 'प्रविष्टि हटा दी गई',
    selectMood: 'आज आप कैसा महसूस कर रहे हैं?',
    journalPlaceholder: 'आज के अपने अनुभव, चुनौतियाँ या विचार लिखें...',
    entriesCount: 'चिंतन दर्ज किए गए',
    dayPrompt: 'आज का विचार',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => TRANSLATIONS.en[key] || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'en' || saved === 'hi') {
        setLanguageState(saved);
      }
    }).catch(() => {});
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang).catch(() => {});
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
  };

  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
