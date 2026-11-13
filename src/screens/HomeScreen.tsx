import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { ProgressRing } from '../components/ProgressRing';
import { TaskItem } from '../components/TaskItem';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { getTodayTopTasks } from '../utils/dayUtils';
import { DAILY_TIPS } from '../data/tips';
import { CAMPUS_EVENTS } from '../data/events';

interface HomeScreenProps {
  onNavigateToTab: (tabName: 'Checklist' | 'Help' | 'Buddy') => void;
  onNavigateToUms: () => void;
  onNavigateToProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToTab,
  onNavigateToUms,
  onNavigateToProfile,
}) => {
  const { user } = useAuth();
  const { tasks, completedTaskIds, currentDay, overallProgress, toggleTaskCompletion } = useApp();
  const { t, language } = useLanguage();

  // Today's top 3 incomplete tasks
  const topTasks = useMemo(() => {
    return getTodayTopTasks(tasks, completedTaskIds, currentDay, 3);
  }, [tasks, completedTaskIds, currentDay]);

  // Tip of the day rotating by day
  const todayTip = useMemo(() => {
    return DAILY_TIPS.find((tip) => tip.day === currentDay) || DAILY_TIPS[0];
  }, [currentDay]);

  // Next upcoming orientation event
  const nextEvent = CAMPUS_EVENTS[0];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Welcome Card */}
      <View style={styles.greetingHeader}>
        <View>
          <Text style={styles.greetingSub}>{user?.residence || 'Fresher'} • {user?.course || 'Campus'}</Text>
          <Text style={styles.greetingTitle}>
            {t('hi')}, {user?.name || 'Aman'} 👋
          </Text>
        </View>

        <TouchableOpacity
          onPress={onNavigateToProfile}
          style={styles.dayBadgeButton}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Open profile to adjust demo day"
        >
          <Icon name="calendar" size={14} color={colors.primaryDark} style={{ marginRight: 4 }} />
          <Text style={styles.dayBadgeText}>Day {currentDay}</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Ring Card */}
      <Card style={styles.progressCard} padding="lg">
        <ProgressRing
          currentDay={currentDay}
          totalDays={15}
          percentage={overallProgress.percentage}
          dayLabel={t('day')}
          ofLabel={t('of15')}
          percentLabel={t('completed')}
        />
        <View style={styles.progressFooter}>
          <Text style={styles.progressStats}>
            {overallProgress.completed} of {overallProgress.total} tasks completed across 15 days
          </Text>
        </View>
      </Card>

      {/* Large Orange "I'm Lost" Action Button */}
      <TouchableOpacity
        onPress={() => onNavigateToTab('Help')}
        style={styles.lostBanner}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel="I am lost. Open campus map and locations help desk."
      >
        <View style={styles.lostLeft}>
          <View style={styles.lostIconCircle}>
            <Icon name="compass" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.lostTitle}>{t('imLost')}</Text>
            <Text style={styles.lostSub}>Find blocks, ATM, library, mess & how to reach</Text>
          </View>
        </View>
        <Icon name="arrow-right" size={20} color={colors.white} />
      </TouchableOpacity>

      {/* Today's Top 3 Tasks Card */}
      <Card style={styles.sectionCard} padding="lg">
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>{t('todayTopTasks')}</Text>
            <Text style={styles.sectionSub}>Day {currentDay} priorities</Text>
          </View>
          <TouchableOpacity
            onPress={() => onNavigateToTab('Checklist')}
            style={styles.viewAllButton}
            accessibilityRole="button"
            accessibilityLabel="View full 15 days checklist"
          >
            <Text style={styles.viewAllText}>{t('viewAllChecklist')}</Text>
            <Icon name="chevron-right" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {topTasks.length > 0 ? (
          topTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isCompleted={completedTaskIds.includes(task.id)}
              onToggle={toggleTaskCompletion}
              compact
              style={{ marginBottom: 8 }}
            />
          ))
        ) : (
          <View style={styles.allDoneBox}>
            <Icon name="check-circle" size={24} color={colors.success} style={{ marginBottom: 6 }} />
            <Text style={styles.allDoneTitle}>{t('allDone')}</Text>
            <Text style={styles.allDoneSub}>
              You have completed all key tasks for Day {currentDay}! Head to the Checklist tab to preview tomorrow.
            </Text>
          </View>
        )}
      </Card>

      {/* Tip of the Day Card */}
      <Card style={styles.tipCard} padding="lg">
        <View style={styles.tipHeader}>
          <View style={styles.tipIconBox}>
            <Icon name="sparkles" size={16} color={colors.primaryDark} />
          </View>
          <Text style={styles.tipBadge}>{t('tipOfTheDay')} • Day {currentDay}</Text>
        </View>
        <Text style={styles.tipTitle}>{todayTip.title}</Text>
        <Text style={styles.tipContent}>{todayTip.tip}</Text>
        <Text style={styles.tipAuthor}>— {todayTip.author}</Text>
      </Card>

      {/* UMS Quick Guide Banner */}
      <Card
        style={styles.umsBannerCard}
        padding="md"
        onPress={onNavigateToUms}
        accessibilityLabel="Open UMS step-by-step portal guides"
      >
        <View style={styles.umsBannerRow}>
          <View style={styles.umsIconBox}>
            <Icon name="book-open" size={20} color={colors.secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.umsBannerTitle}>{t('umsGuide')}</Text>
            <Text style={styles.umsBannerSub}>Login, timetable, 75% attendance & fees explained</Text>
          </View>
          <Icon name="chevron-right" size={18} color={colors.secondary} />
        </View>
      </Card>

      {/* Upcoming This Week Card */}
      <Card style={styles.eventCard} padding="lg">
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>{t('upcomingThisWeek')}</Text>
            <Text style={styles.sectionSub}>Orientation & Freshers welcome</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigateToTab('Buddy')} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>All Events</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventBox}>
          <View style={styles.eventDateBadge}>
            <Icon name="calendar" size={16} color={colors.primary} />
            <Text style={styles.eventDateText}>{nextEvent.date}</Text>
          </View>
          <Text style={styles.eventTitle}>{nextEvent.title}</Text>
          <Text style={styles.eventVenue}>📍 {nextEvent.venue}</Text>
          <Text style={styles.eventDesc}>{nextEvent.description}</Text>
        </View>
      </Card>

      {/* Buddy Senior Quick Help Banner */}
      <Card
        style={styles.buddyCard}
        padding="md"
      >
        <View style={styles.buddyRow}>
          <View style={styles.buddyAvatarBox}>
            <Icon name="message-circle" size={20} color={colors.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.buddyTitle}>Have questions or feeling lost?</Text>
            <Text style={styles.buddySub}>Rohan (3rd Year CSE) is available to guide you</Text>
          </View>
          <Button
            title="Chat"
            variant="success"
            size="sm"
            fullWidth={false}
            onPress={() => onNavigateToTab('Buddy')}
          />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: 4,
  },
  greetingSub: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeights.medium,
  },
  greetingTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  dayBadgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: '#FFE082',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
  },
  dayBadgeText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
  progressCard: {
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  progressFooter: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  progressStats: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  lostBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary, // Large orange button
    borderRadius: borderRadius.card,
    padding: spacing.md + 2,
    marginBottom: spacing.md,
    minHeight: 64,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  lostLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lostIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lostTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    fontFamily: typography.fontFamily,
  },
  lostSub: {
    fontSize: typography.fontSizes.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  sectionCard: {
    marginBottom: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  sectionSub: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  viewAllText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.primary,
    fontFamily: typography.fontFamily,
    marginRight: 2,
  },
  allDoneBox: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.successLight,
    borderRadius: borderRadius.md,
  },
  allDoneTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.success,
    fontFamily: typography.fontFamily,
    marginBottom: 4,
  },
  allDoneSub: {
    fontSize: typography.fontSizes.xs,
    color: '#1E6B3E',
    fontFamily: typography.fontFamily,
    textAlign: 'center',
    lineHeight: 18,
  },
  tipCard: {
    backgroundColor: '#FFFBF2',
    borderColor: '#FFE0B2',
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  tipBadge: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
    letterSpacing: 0.5,
  },
  tipTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginBottom: 6,
  },
  tipContent: {
    fontSize: typography.fontSizes.sm,
    color: colors.textDark,
    lineHeight: 20,
    fontFamily: typography.fontFamily,
    marginBottom: 8,
  },
  tipAuthor: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontStyle: 'italic',
    fontFamily: typography.fontFamily,
  },
  umsBannerCard: {
    backgroundColor: colors.secondarySubtle,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  umsBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  umsIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  umsBannerTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  umsBannerSub: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  eventCard: {
    marginBottom: spacing.md,
  },
  eventBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  eventDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventDateText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
    marginLeft: 6,
  },
  eventTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginBottom: 4,
  },
  eventVenue: {
    fontSize: typography.fontSizes.xs,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    marginBottom: 6,
  },
  eventDesc: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    lineHeight: 18,
    fontFamily: typography.fontFamily,
  },
  buddyCard: {
    backgroundColor: '#F0F9F4',
    borderColor: '#C6EAD4',
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  buddyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buddyAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buddyTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  buddySub: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 1,
  },
});
