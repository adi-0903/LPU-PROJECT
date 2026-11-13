# First 15 Days - LPU Campus Onboarding Companion

A mobile onboarding companion for first-year university students during their first two weeks at Lovely Professional University (LPU, Punjab). Built with React Native, Expo, and TypeScript for a Design Thinking prototype.

## Quick Demo Credentials
- **Registration Number**: `12500000` (8 digits)
- **Password**: `Fresher@123`
- **Name**: Aman (B.Tech, Hostel resident)
- Or tap the **"Fill Demo"** button on the Login screen, or select **"Continue as guest"**.

## Features Included
1. **Mock Auth & Registration**:
   - 8-digit numeric validation, password length checks, show/hide eye toggle.
   - User account persistence in AsyncStorage.
   - Persistent login sessions with automatic reload.
2. **Setup Screen**:
   - Choose Hostel or Day Scholar.
   - Choose Course (B.Tech, BCA, BBA, MBA, Other).
   - Arrival date picker with dynamic Day 1-15 calculation.
3. **Home Screen**:
   - Welcome greeting with language switcher (EN | हिं).
   - SVG Circular Progress Ring showing Day X of 15 and percent complete.
   - Today's top 3 incomplete tasks (tappable to complete).
   - Prominent orange "I'm Lost" button opening campus places.
   - Tip of the day rotating by day.
   - Upcoming orientation events.
4. **Checklist Screen**:
   - Horizontally scrollable Day 1 to 15 selector with mini progress bars and completion tick badges.
   - Tasks grouped by category: Academics, Hostel, Banking & SIM, Campus, Social.
   - Hostel-only tasks hidden for day scholars.
   - Real-time progress bar per day.
5. **Help Screen ("I'm Lost")**:
   - Live search for blocks, gates, ATMs, and FAQs.
   - Quick category chips.
   - Place detail modal with "How to reach", landmarks, and timings.
   - Interactive SVG Campus Map modal with walking times and shuttle routes.
   - 8-question FAQ accordion with filterable answers.
6. **UMS Guide Screen**:
   - Step-by-step guides for Logging in, Timetable, Attendance (75% rule), and Paying Fees.
   - Mock portal previews and senior escalation button.
7. **Buddy Screen**:
   - Matched senior mentor card (Rohan Sharma, 3rd Year CSE).
   - Mock Chat screen with real-time simulated responses and quick-reply presets.
   - Fellow freshers in hostel list.
   - Orientation events list with persistent reminder toggles.
8. **Profile Screen**:
   - Student info and registration number.
   - Interactive **Demo Day Stepper (1 to 15)** to jump to any stage during presentations.
   - Reset Demo Data and Logout.

## Running in Expo Go
To run this project on a mobile phone with Expo:

```bash
# 1. Install dependencies
npm install

# 2. Start the Expo development server
npx expo start
```
Scan the QR code with **Expo Go** on Android or the Camera app on iOS.
