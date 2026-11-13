import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { TaskCategory } from '../types';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { TaskItem } from '../components/TaskItem';
import { Chip } from '../components/Chip';
import { EmptyState } from '../components/EmptyState';
import { Icon } from '../components/Icon';
import { filterTasks, calculateProgress } from '../utils/dayUtils';

const CATEGORIES: ('All' | TaskCategory)[] = [
  'All',
  'Academics',
  'Hostel',
  'Banking & SIM',
  'Campus',
  'Social',
];

export const ChecklistScreen: React.FC = () => {
  const { tasks, completedTaskIds, currentDay, toggleTaskCompletion, isHostel } = useApp();
  const { t } = useLanguage();

  const [selectedDay, setSelectedDay] = useState<number>(currentDay);
  const [selectedCategory, setSelectedCategory] = useState<'All' | TaskCategory>('All');

  // Days 1 through 15
  const days = useMemo(() => Array.from({ length: 15 }, (_, i) => i + 1), []);

  // Filter tasks for selected day & category
  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, selectedDay, isHostel, selectedCategory);
  }, [tasks, selectedDay, isHostel, selectedCategory]);

  // Selected Day Progress
  const dayProgress = useMemo(() => {
    const dayAllTasks = filterTasks(tasks, selectedDay, isHostel);
    return calculateProgress(dayAllTasks, completedTaskIds);
  }, [tasks, selectedDay, isHostel, completedTaskIds]);

  // Group tasks by category
  const groupedTasks = useMemo(() => {
    const map = new Map<TaskCategory, typeof filteredTasks>();
    filteredTasks.forEach((task) => {
      const list = map.get(task.category) || [];
      list.push(task);
      map.set(task.category, list);
    });
    return map;
  }, [filteredTasks]);

  return (
    <View style={styles.container}>
      {/* Horizontally Scrollable Day 1 to 15 Selector */}
      <View style={styles.daySelectorWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daySelectorContent}
        >
          {days.map((d) => {
            const isSelected = selectedDay === d;
            const isCurrent = currentDay === d;
            const dayTasks = filterTasks(tasks, d, isHostel);
            const { percentage } = calculateProgress(dayTasks, completedTaskIds);
            const isFullyCompleted = dayTasks.length > 0 && percentage === 100;

            return (
              <TouchableOpacity
                key={d}
                onPress={() => setSelectedDay(d)}
                style={[
                  styles.dayButton,
                  isSelected && styles.dayButtonSelected,
                  isCurrent && !isSelected && styles.dayButtonCurrent,
                ]}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Day ${d}. ${isFullyCompleted ? 'All tasks complete.' : `${percentage}% done.`}`}
              >
                {/* Done badge or current day dot */}
                {isFullyCompleted ? (
                  <View style={styles.doneTickBadge}>
                    <Icon name="check" size={10} color={colors.white} />
                  </View>
                ) : isCurrent ? (
                  <View style={styles.currentDot} />
                ) : null}

                <Text
                  style={[
                    styles.dayLabel,
                    isSelected && styles.dayLabelSelected,
                  ]}
                >
                  DAY
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    isSelected && styles.dayNumberSelected,
                  ]}
                >
                  {d}
                </Text>

                {/* Progress bar inside pill */}
                <View style={styles.miniProgressTrack}>
                  <View
                    style={[
                      styles.miniProgressFill,
                      { width: `${percentage}%` },
                      isSelected && styles.miniProgressFillSelected,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Day Header Banner with Progress Bar */}
        <View style={styles.dayBanner}>
          <View style={styles.dayBannerTop}>
            <View>
              <Text style={styles.dayBannerTitle}>
                Day {selectedDay} Orientation Tasks
              </Text>
              <Text style={styles.dayBannerSub}>
                {dayProgress.completed} of {dayProgress.total} completed ({dayProgress.percentage}%)
              </Text>
            </View>

            {selectedDay === currentDay ? (
              <View style={styles.todayPill}>
                <Text style={styles.todayPillText}>TODAY</Text>
              </View>
            ) : null}
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${dayProgress.percentage}%` },
              ]}
            />
          </View>
        </View>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {CATEGORIES.map((cat) => {
            if (cat === 'Hostel' && !isHostel) return null;
            return (
              <Chip
                key={cat}
                label={cat}
                selected={selectedCategory === cat}
                onPress={() => setSelectedCategory(cat)}
              />
            );
          })}
        </ScrollView>

        {/* Grouped or Filtered Tasks List */}
        {filteredTasks.length > 0 ? (
          selectedCategory === 'All' ? (
            Array.from(groupedTasks.entries()).map(([category, catTasks]) => (
              <View key={category} style={styles.categoryGroup}>
                <View style={styles.categoryTitleRow}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <Text style={styles.categoryCount}>({catTasks.length})</Text>
                </View>

                {catTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isCompleted={completedTaskIds.includes(task.id)}
                    onToggle={toggleTaskCompletion}
                  />
                ))}
              </View>
            ))
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isCompleted={completedTaskIds.includes(task.id)}
                onToggle={toggleTaskCompletion}
              />
            ))
          )
        ) : (
          <EmptyState
            icon="check-circle"
            title={t('noTasksFound')}
            description="Try switching categories or explore another orientation day above."
            actionText="View All Categories"
            onAction={() => setSelectedCategory('All')}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  daySelectorWrapper: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
  },
  daySelectorContent: {
    paddingHorizontal: spacing.md,
    gap: 8,
  },
  dayButton: {
    width: 60,
    height: 72,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 4,
  },
  dayButtonSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  dayButtonCurrent: {
    borderColor: colors.primary,
    backgroundColor: '#FFF8E7',
  },
  currentDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.primary,
  },
  doneTickBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    letterSpacing: 0.5,
  },
  dayLabelSelected: {
    color: '#CBD5E1',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: typography.fontWeights.bold,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    lineHeight: 22,
  },
  dayNumberSelected: {
    color: colors.white,
  },
  miniProgressTrack: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: 4,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  miniProgressFillSelected: {
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  dayBanner: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  dayBannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayBannerTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  dayBannerSub: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  todayPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
  },
  todayPillText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceSubtle,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 3,
  },
  chipsScroll: {
    paddingBottom: spacing.md,
  },
  categoryGroup: {
    marginBottom: spacing.md,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  categoryTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    letterSpacing: 0.2,
  },
  categoryCount: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginLeft: 6,
  },
});
