import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { LpuLogo } from '../components/LpuLogo';
import { Reflections } from '../components/Reflections';

interface ProfileScreenProps {
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const { user, logout } = useAuth();
  const { currentDay, setDemoDay, resetDemoData } = useApp();
  const { language, setLanguage, t } = useLanguage();

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetSuccessNotice, setResetSuccessNotice] = useState(false);

  const handleDayDecrement = () => {
    if (currentDay > 1) {
      setDemoDay(currentDay - 1);
    }
  };

  const handleDayIncrement = () => {
    if (currentDay < 15) {
      setDemoDay(currentDay + 1);
    }
  };

  const handlePerformReset = async () => {
    setShowResetModal(false);
    await resetDemoData();
    setResetSuccessNotice(true);
    setTimeout(() => setResetSuccessNotice(false), 3000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
        >
          <Icon name="arrow-left" size={22} color={colors.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card style={styles.profileCard} padding="lg">
          <View style={styles.avatarRow}>
            <Avatar name={user?.name || 'Aman'} size="xl" />
            <View style={styles.profileDetails}>
              <Text style={styles.userName}>{user?.name || 'Aman'}</Text>
              <Text style={styles.userReg}>Reg: {user?.regNumber || '12500000'}</Text>

              <View style={styles.badgesRow}>
                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>{user?.residence || 'Hostel'}</Text>
                </View>
                <View style={[styles.infoBadge, { backgroundColor: colors.secondarySubtle }]}>
                  <Text style={[styles.infoBadgeText, { color: colors.secondary }]}>
                    {user?.course || 'B.Tech'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Demo Day Stepper Card (CRITICAL for presentation/testing) */}
        <Card style={styles.demoCard} padding="lg">
          <View style={styles.demoCardHeader}>
            <View style={styles.demoIconBox}>
              <Icon name="sparkles" size={18} color={colors.primaryDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.demoTitle}>{t('demoSetDay')}</Text>
              <Text style={styles.demoSub}>
                Quickly jump between Day 1 and Day 15 to showcase onboarding phases
              </Text>
            </View>
          </View>

          {/* Stepper control */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              onPress={handleDayDecrement}
              disabled={currentDay <= 1}
              style={[styles.stepperButton, currentDay <= 1 && styles.stepperButtonDisabled]}
              accessibilityRole="button"
              accessibilityLabel="Decrease day"
            >
              <Text style={styles.stepperBtnText}>−</Text>
            </TouchableOpacity>

            <View style={styles.stepperValueBox}>
              <Text style={styles.stepperDayLabel}>CURRENT PHASE</Text>
              <Text style={styles.stepperDayValue}>Day {currentDay}</Text>
              <Text style={styles.stepperDayTotal}>of 15 days</Text>
            </View>

            <TouchableOpacity
              onPress={handleDayIncrement}
              disabled={currentDay >= 15}
              style={[styles.stepperButton, currentDay >= 15 && styles.stepperButtonDisabled]}
              accessibilityRole="button"
              accessibilityLabel="Increase day"
            >
              <Text style={styles.stepperBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Quick jump pills */}
          <View style={styles.quickJumpRow}>
            {[1, 3, 7, 10, 15].map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => setDemoDay(d)}
                style={[styles.quickJumpPill, currentDay === d && styles.quickJumpPillActive]}
              >
                <Text
                  style={[
                    styles.quickJumpText,
                    currentDay === d && styles.quickJumpTextActive,
                  ]}
                >
                  Day {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Daily Reflections Journal Component */}
        <Reflections />

        {/* Language Selection Card */}
        <Card style={styles.sectionCard} padding="lg">
          <Text style={styles.sectionTitle}>App Language / भाषा</Text>
          <View style={styles.langSelectorRow}>
            <TouchableOpacity
              onPress={() => setLanguage('en')}
              style={[styles.langOption, language === 'en' && styles.langOptionActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.langOptionText, language === 'en' && styles.langOptionTextActive]}>
                English (EN)
              </Text>
              {language === 'en' && <Icon name="check" size={16} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setLanguage('hi')}
              style={[styles.langOption, language === 'hi' && styles.langOptionActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.langOptionText, language === 'hi' && styles.langOptionTextActive]}>
                हिन्दी (Hindi)
              </Text>
              {language === 'hi' && <Icon name="check" size={16} color={colors.primary} />}
            </TouchableOpacity>
          </View>
        </Card>

        {/* Success Alert */}
        {resetSuccessNotice ? (
          <View style={styles.successBanner}>
            <Icon name="check-circle" size={16} color={colors.success} style={{ marginRight: 8 }} />
            <Text style={styles.successText}>{t('resetSuccess')}</Text>
          </View>
        ) : null}

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <Button
            title={t('resetDemoData')}
            icon="rotate-ccw"
            variant="outline"
            onPress={() => setShowResetModal(true)}
            style={{ marginBottom: 12 }}
          />

          <Button
            title={t('logout')}
            icon="log-out"
            variant="danger"
            onPress={logout}
          />
        </View>

        {/* Design Thinking Prototype Note */}
        <View style={styles.prototypeNotice}>
          <LpuLogo variant="horizontal" size={34} style={{ marginBottom: 10 }} />
          <Text style={styles.prototypeNoticeText}>
            First 15 Days • LPU Campus Onboarding Prototype{'\n'}
            Created for Design Thinking Research • Runs completely on local mock data
          </Text>
        </View>
      </ScrollView>

      {/* Reset Confirmation Dialog */}
      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIconBox}>
              <Icon name="rotate-ccw" size={24} color={colors.primaryDark} />
            </View>
            <Text style={styles.confirmTitle}>{t('resetConfirmTitle')}</Text>
            <Text style={styles.confirmDesc}>{t('resetConfirmMsg')}</Text>

            <View style={styles.confirmBtnRow}>
              <Button
                title={t('cancel')}
                variant="ghost"
                onPress={() => setShowResetModal(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title={t('confirm')}
                variant="primary"
                onPress={handlePerformReset}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  profileCard: {
    marginBottom: spacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileDetails: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  userReg: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  infoBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  infoBadgeText: {
    fontSize: 11,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
  demoCard: {
    backgroundColor: '#FFFBF2',
    borderWidth: 1.5,
    borderColor: '#FFE082',
    marginBottom: spacing.md,
  },
  demoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  demoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  demoTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
  demoSub: {
    fontSize: typography.fontSizes.xs,
    color: '#8A5B00',
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    marginBottom: 12,
  },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  stepperBtnText: {
    fontSize: 24,
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
    lineHeight: 28,
  },
  stepperValueBox: {
    alignItems: 'center',
  },
  stepperDayLabel: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    letterSpacing: 0.8,
  },
  stepperDayValue: {
    fontSize: 26,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    lineHeight: 30,
  },
  stepperDayTotal: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  quickJumpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickJumpPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  quickJumpPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickJumpText: {
    fontSize: 11,
    fontWeight: typography.fontWeights.medium,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
  quickJumpTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
  },
  sectionCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginBottom: 10,
  },
  langSelectorRow: {
    gap: 8,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langOptionActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFF9ED',
  },
  langOptionText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
  },
  langOptionTextActive: {
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: 12,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  successText: {
    fontSize: typography.fontSizes.xs,
    color: colors.success,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeights.bold,
  },
  actionsSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  prototypeNotice: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  prototypeNoticeText: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    textAlign: 'center',
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  confirmCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  confirmIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  confirmTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginBottom: 6,
  },
  confirmDesc: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  confirmBtnRow: {
    flexDirection: 'row',
    width: '100%',
  },
});
