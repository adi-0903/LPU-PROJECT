import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { SENIOR_MENTORS, FELLOW_FRESHERS } from '../data/mentors';
import { CAMPUS_EVENTS } from '../data/events';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';

interface BuddyScreenProps {
  onOpenChat: (initialMessage?: string) => void;
}

export const BuddyScreen: React.FC<BuddyScreenProps> = ({ onOpenChat }) => {
  const { eventReminders, toggleEventReminder } = useApp();
  const { t } = useLanguage();

  const primaryMentor = SENIOR_MENTORS[0]; // Rohan Sharma (3rd Year CSE)

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Screen Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('seniorMentor')}</Text>
        <Text style={styles.headerSubtitle}>
          Connect with experienced seniors who have been through the same first 15 days
        </Text>
      </View>

      {/* Primary Senior Mentor Card */}
      <Card style={styles.mentorCard} padding="lg">
        <View style={styles.mentorTopRow}>
          <Avatar name={primaryMentor.name} size="lg" showStatus status="online" />
          <View style={styles.mentorInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.mentorName}>{primaryMentor.name}</Text>
              <View style={styles.verifiedBadge}>
                <Icon name="check" size={10} color={colors.white} />
              </View>
            </View>
            <Text style={styles.mentorCourse}>{primaryMentor.course}</Text>
            <Text style={styles.mentorYear}>{primaryMentor.year} • {primaryMentor.hostel}</Text>
          </View>
        </View>

        <Text style={styles.mentorBio}>{primaryMentor.bio}</Text>

        <View style={styles.mentorMetaBox}>
          <View style={styles.metaRow}>
            <Icon name="sparkles" size={14} color={colors.primaryDark} style={{ marginRight: 6 }} />
            <Text style={styles.metaText}>
              <Text style={{ fontWeight: 'bold' }}>Can help with: </Text>
              {primaryMentor.specialty}
            </Text>
          </View>
          <View style={[styles.metaRow, { marginTop: 4 }]}>
            <Icon name="clock" size={14} color={colors.textMuted} style={{ marginRight: 6 }} />
            <Text style={styles.metaText}>
              <Text style={{ fontWeight: 'bold' }}>Available: </Text>
              {primaryMentor.availability}
            </Text>
          </View>
        </View>

        <Button
          title={t('messageSenior')}
          icon="message-circle"
          variant="primary"
          size="md"
          onPress={() => onOpenChat()}
          style={styles.messageButton}
        />
      </Card>

      {/* Fellow Freshers in your hostel */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('fellowFreshers')}</Text>
          <Text style={styles.sectionCount}>({FELLOW_FRESHERS.length})</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.freshersScroll}
        >
          {FELLOW_FRESHERS.map((fresher) => (
            <TouchableOpacity
              key={fresher.id}
              style={styles.fresherCard}
              activeOpacity={0.8}
              onPress={() => onOpenChat(`Hey ${fresher.name}! I am in the same hostel block.`)}
              accessibilityRole="button"
              accessibilityLabel={`Fellow fresher ${fresher.name} from ${fresher.hometown}, room ${fresher.room}`}
            >
              <Avatar name={fresher.name} size="md" showStatus status="online" />
              <Text style={styles.fresherName} numberOfLines={1}>{fresher.name}</Text>
              <Text style={styles.fresherRoom}>{fresher.hostel} • #{fresher.room}</Text>
              <Text style={styles.fresherCity} numberOfLines={1}>📍 {fresher.hometown}</Text>

              <View style={styles.sayHiPill}>
                <Text style={styles.sayHiText}>Say Hi 👋</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* This Week's Events with Reminder Toggle */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('campusEvents')}</Text>
          <Text style={styles.sectionCount}>({CAMPUS_EVENTS.length})</Text>
        </View>

        {CAMPUS_EVENTS.map((event) => {
          const hasReminder = eventReminders.includes(event.id);
          return (
            <Card key={event.id} style={styles.eventCard} padding="md">
              <View style={styles.eventRow}>
                <View style={styles.eventDateCol}>
                  <Text style={styles.eventDateDay}>
                    {event.date.split(',')[0].slice(0, 3).toUpperCase()}
                  </Text>
                  <Icon name="calendar" size={16} color={colors.primary} style={{ marginTop: 2 }} />
                </View>

                <View style={styles.eventDetails}>
                  <View style={styles.eventCategoryTag}>
                    <Text style={styles.eventCategoryText}>{event.category}</Text>
                  </View>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>⏰ {event.time}</Text>
                  <Text style={styles.eventVenue}>📍 {event.venue}</Text>
                  <Text style={styles.eventDesc}>{event.description}</Text>
                </View>
              </View>

              {/* Add / Remove Reminder Button */}
              <TouchableOpacity
                onPress={() => toggleEventReminder(event.id)}
                style={[
                  styles.reminderButton,
                  hasReminder && styles.reminderButtonActive,
                ]}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`${hasReminder ? 'Remove' : 'Add'} reminder for ${event.title}`}
              >
                <Icon
                  name={hasReminder ? 'bell-ring' : 'bell'}
                  size={14}
                  color={hasReminder ? colors.white : colors.primaryDark}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.reminderButtonText,
                    hasReminder && styles.reminderButtonTextActive,
                  ]}
                >
                  {hasReminder ? t('reminderSet') : t('addReminder')}
                </Text>
              </TouchableOpacity>
            </Card>
          );
        })}
      </View>
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
  header: {
    marginBottom: spacing.md,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  headerSubtitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 4,
  },
  mentorCard: {
    marginBottom: spacing.lg,
  },
  mentorTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  mentorInfo: {
    marginLeft: 14,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mentorName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  mentorCourse: {
    fontSize: typography.fontSizes.xs,
    color: colors.textDark,
    fontWeight: typography.fontWeights.medium,
    fontFamily: typography.fontFamily,
    marginTop: 1,
  },
  mentorYear: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 1,
  },
  mentorBio: {
    fontSize: typography.fontSizes.sm,
    color: colors.textDark,
    lineHeight: 20,
    fontFamily: typography.fontFamily,
    marginBottom: spacing.md,
  },
  mentorMetaBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: 10,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  metaText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    flex: 1,
    lineHeight: 16,
  },
  messageButton: {
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  sectionCount: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginLeft: 6,
  },
  freshersScroll: {
    paddingBottom: spacing.sm,
    gap: 10,
  },
  fresherCard: {
    width: 130,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.card,
    padding: 12,
    alignItems: 'center',
  },
  fresherName: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginTop: 8,
  },
  fresherRoom: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: typography.fontWeights.medium,
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  fresherCity: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  sayHiPill: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
    marginTop: 8,
  },
  sayHiText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.medium,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  eventCard: {
    marginBottom: spacing.sm + 2,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  eventDateCol: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventDateDay: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
  eventDetails: {
    flex: 1,
  },
  eventCategoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondarySubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  eventCategoryText: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  eventTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  eventTime: {
    fontSize: typography.fontSizes.xs,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  eventVenue: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 1,
  },
  eventDesc: {
    fontSize: 11,
    color: colors.textDark,
    lineHeight: 16,
    fontFamily: typography.fontFamily,
    marginTop: 4,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#FFF8E7',
    borderRadius: borderRadius.sm,
    paddingVertical: 8,
    marginTop: 4,
  },
  reminderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  reminderButtonText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
  reminderButtonTextActive: {
    color: colors.white,
  },
});
