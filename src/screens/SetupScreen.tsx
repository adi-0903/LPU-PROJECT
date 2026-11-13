import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { ResidenceType, CourseType } from '../types';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { LpuLogo } from '../components/LpuLogo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { calculateCurrentDay } from '../utils/dayUtils';

const COURSES: CourseType[] = ['B.Tech', 'BCA', 'BBA', 'MBA', 'Other'];

export const SetupScreen: React.FC = () => {
  const { completeSetup, user } = useAuth();
  const { t } = useLanguage();

  const [residence, setResidence] = useState<ResidenceType>('Hostel');
  const [course, setCourse] = useState<CourseType>('B.Tech');
  const [daysAgo, setDaysAgo] = useState<number>(0); // 0 = today (Day 1)
  const [loading, setLoading] = useState(false);

  // Compute arrival ISO date string
  const arrivalDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  const previewDay = calculateCurrentDay(arrivalDate);

  const handleStart = async () => {
    setLoading(true);
    await completeSetup(residence, course, arrivalDate);
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <LpuLogo variant="horizontal" size={40} style={{ marginBottom: 12 }} />
          <Text style={styles.stepKicker}>Quick Campus Setup</Text>
          <Text style={styles.title}>{t('setupTitle')}</Text>
          <Text style={styles.subtitle}>
            Welcome, {user?.name || 'Fresher'}! {t('setupSubtitle')}
          </Text>
        </View>

        {/* 1. Residence Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>1. {t('residenceType')}</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => setResidence('Hostel')}
              style={[
                styles.optionCard,
                residence === 'Hostel' && styles.optionCardActive,
              ]}
              activeOpacity={0.8}
            >
              <View style={[styles.optionIcon, residence === 'Hostel' && styles.optionIconActive]}>
                <Icon
                  name="home"
                  size={22}
                  color={residence === 'Hostel' ? colors.white : colors.secondary}
                />
              </View>
              <Text
                style={[
                  styles.optionTitle,
                  residence === 'Hostel' && styles.optionTitleActive,
                ]}
              >
                {t('hostel')}
              </Text>
              <Text style={styles.optionDescription}>
                Living on-campus in BH or GH hostels with mess & curfew
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setResidence('Day scholar')}
              style={[
                styles.optionCard,
                residence === 'Day scholar' && styles.optionCardActive,
              ]}
              activeOpacity={0.8}
            >
              <View style={[styles.optionIcon, residence === 'Day scholar' && styles.optionIconActive]}>
                <Icon
                  name="compass"
                  size={22}
                  color={residence === 'Day scholar' ? colors.white : colors.secondary}
                />
              </View>
              <Text
                style={[
                  styles.optionTitle,
                  residence === 'Day scholar' && styles.optionTitleActive,
                ]}
              >
                {t('dayScholar')}
              </Text>
              <Text style={styles.optionDescription}>
                Commuting daily from home or off-campus PG in Phagwara/Jalandhar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Course Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>2. {t('courseSelect')}</Text>
          <View style={styles.chipsWrap}>
            {COURSES.map((c) => {
              const active = course === c;
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCourse(c)}
                  style={[styles.courseChip, active && styles.courseChipActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.courseChipText, active && styles.courseChipTextActive]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. Arrival Date Selector */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>3. {t('arrivalDate')}</Text>
          <Text style={styles.helperText}>
            We calculate your orientation progress based on your arrival day:
          </Text>

          <View style={styles.daysAgoSelector}>
            {[
              { label: 'Today', days: 0 },
              { label: 'Yesterday', days: 1 },
              { label: '2 days ago', days: 2 },
              { label: '4 days ago', days: 4 },
              { label: '1 week ago', days: 6 },
            ].map((opt) => {
              const active = daysAgo === opt.days;
              return (
                <TouchableOpacity
                  key={opt.days}
                  onPress={() => setDaysAgo(opt.days)}
                  style={[styles.dayPill, active && styles.dayPillActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayPillText, active && styles.dayPillTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Computed Day Banner */}
          <View style={styles.previewDayBanner}>
            <Icon name="calendar" size={18} color={colors.primaryDark} style={{ marginRight: 8 }} />
            <Text style={styles.previewDayText}>
              Your journey starts at: <Text style={{ fontWeight: 'bold' }}>Day {previewDay} of 15</Text>
            </Text>
          </View>
        </View>

        {/* Start Button */}
        <Button
          title={t('startMy15Days')}
          onPress={handleStart}
          loading={loading}
          variant="primary"
          size="lg"
          icon="arrow-right"
          iconPosition="right"
          style={styles.startButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
  },
  container: {
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: spacing.lg,
  },
  stepKicker: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
    marginBottom: 4,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginBottom: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
  },
  optionCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFF9ED',
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  optionIconActive: {
    backgroundColor: colors.primary,
  },
  optionTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    marginBottom: 4,
  },
  optionTitleActive: {
    color: colors.primaryDark,
  },
  optionDescription: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    textAlign: 'center',
    lineHeight: 15,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courseChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
  },
  courseChipActive: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondary,
  },
  courseChipText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
  },
  courseChipTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
  },
  helperText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginBottom: 10,
  },
  daysAgoSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  dayPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayPillText: {
    fontSize: typography.fontSizes.xs,
    fontFamily: typography.fontFamily,
    color: colors.textDark,
    fontWeight: typography.fontWeights.medium,
  },
  dayPillTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
  },
  previewDayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: 10,
    borderRadius: borderRadius.sm,
  },
  previewDayText: {
    fontSize: typography.fontSizes.sm,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
  startButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
});
