import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { colors, typography } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Header } from '../components/Header';
import { Icon, IconName } from '../components/Icon';
import { LpuLogo } from '../components/LpuLogo';
import { resolveAppStage } from '../utils/authFlow';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { SetupScreen } from '../screens/SetupScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ChecklistScreen } from '../screens/ChecklistScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { BuddyScreen } from '../screens/BuddyScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { UmsGuideScreen } from '../screens/UmsGuideScreen';
import { ChatScreen } from '../screens/ChatScreen';

export type TabScreen = 'Home' | 'Checklist' | 'Help' | 'Buddy';
export type ModalScreen = 'None' | 'Profile' | 'UmsGuide' | 'Chat';

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, hasCompletedSetup, isLoading } = useAuth();
  const { t } = useLanguage();

  // Main flow active tab
  const [activeTab, setActiveTab] = useState<TabScreen>('Home');

  // Stack/Modal overlay screens
  const [activeModal, setActiveModal] = useState<ModalScreen>('None');
  const [chatInitialMsg, setChatInitialMsg] = useState<string | undefined>();

  // Reset modal/tab states cleanly whenever user signs out
  useEffect(() => {
    if (!isAuthenticated) {
      setActiveTab('Home');
      setActiveModal('None');
      setChatInitialMsg(undefined);
    }
  }, [isAuthenticated]);

  const stage = resolveAppStage({
    isLoading,
    isAuthenticated,
    hasCompletedSetup,
  });

  if (stage === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <LpuLogo variant="mark" size={68} style={{ marginBottom: 14 }} />
        <Text style={styles.loadingText}>Loading LPU First 15 Days...</Text>
      </View>
    );
  }

  // 1. Auth Flow: Login Screen (Always shown first to new students; no Create Account)
  if (stage === 'login') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoginScreen />
      </SafeAreaView>
    );
  }

  // 2. Setup Screen: Shown once after first login if not completed
  if (stage === 'setup') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <SetupScreen />
      </SafeAreaView>
    );
  }

  // 3. Detail / Modal Stack Screens
  if (activeModal === 'Profile') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ProfileScreen onBack={() => setActiveModal('None')} />
      </SafeAreaView>
    );
  }

  if (activeModal === 'UmsGuide') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <UmsGuideScreen
          onBack={() => setActiveModal('None')}
          onAskSenior={(topic) => {
            setChatInitialMsg(`Hi bhaiya, I need help with the UMS guide: "${topic}".`);
            setActiveModal('Chat');
          }}
        />
      </SafeAreaView>
    );
  }

  if (activeModal === 'Chat') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ChatScreen
          onBack={() => {
            setActiveModal('None');
            setChatInitialMsg(undefined);
          }}
          initialMessage={chatInitialMsg}
        />
      </SafeAreaView>
    );
  }

  // 4. Main Tab Navigation
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <HomeScreen
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onNavigateToUms={() => setActiveModal('UmsGuide')}
            onNavigateToProfile={() => setActiveModal('Profile')}
          />
        );
      case 'Checklist':
        return <ChecklistScreen />;
      case 'Help':
        return (
          <HelpScreen
            onNavigateToBuddy={(msg) => {
              if (msg) {
                setChatInitialMsg(msg);
                setActiveModal('Chat');
              } else {
                setActiveTab('Buddy');
              }
            }}
            onNavigateToUms={() => setActiveModal('UmsGuide')}
          />
        );
      case 'Buddy':
        return (
          <BuddyScreen
            onOpenChat={(msg) => {
              setChatInitialMsg(msg);
              setActiveModal('Chat');
            }}
          />
        );
      default:
        return null;
    }
  };

  const tabs: { key: TabScreen; labelKey: 'home' | 'checklist' | 'help' | 'buddy'; icon: IconName }[] = [
    { key: 'Home', labelKey: 'home', icon: 'home' },
    { key: 'Checklist', labelKey: 'checklist', icon: 'check-square' },
    { key: 'Help', labelKey: 'help', icon: 'help-circle' },
    { key: 'Buddy', labelKey: 'buddy', icon: 'message-circle' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        {/* Top Header */}
        <Header
          onProfilePress={() => setActiveModal('Profile')}
        />

        {/* Tab View Body */}
        <View style={styles.tabContent}>{renderTabContent()}</View>

        {/* Bottom Tab Bar */}
        <View style={styles.bottomBar}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={styles.tabItem}
                activeOpacity={0.7}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`${t(tab.labelKey)} tab`}
              >
                <View style={[styles.tabIconCircle, isActive && styles.tabIconCircleActive]}>
                  <Icon
                    name={tab.icon}
                    size={20}
                    color={isActive ? colors.primary : colors.textMuted}
                  />
                </View>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {t(tab.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLogo: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  loadingLogoText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: typography.fontWeights.bold,
  },
  loadingText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  tabContent: {
    flex: 1,
  },
  bottomBar: {
    height: 62,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
    shadowColor: '#1B2A49',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingVertical: 4,
  },
  tabIconCircle: {
    width: 32,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabIconCircleActive: {
    backgroundColor: colors.primaryLight,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: typography.fontWeights.medium,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  tabLabelActive: {
    color: colors.primaryDark,
    fontWeight: typography.fontWeights.bold,
  },
});
