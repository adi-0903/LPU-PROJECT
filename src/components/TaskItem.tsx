import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Task } from '../types';
import { colors, typography, borderRadius, spacing } from '../theme';
import { Icon } from './Icon';

interface TaskItemProps {
  task: Task;
  isCompleted: boolean;
  onToggle: (taskId: string) => void;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isCompleted,
  onToggle,
  style,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View
      style={[
        styles.card,
        isCompleted && styles.completedCard,
        compact && styles.compactCard,
        style,
      ]}
    >
      <View style={styles.mainRow}>
        {/* Checkbox tap area */}
        <TouchableOpacity
          onPress={() => onToggle(task.id)}
          style={styles.checkboxContainer}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}
          accessibilityLabel={`Mark "${task.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
            {isCompleted ? <Icon name="check" size={14} color={colors.white} /> : null}
          </View>
        </TouchableOpacity>

        {/* Content area */}
        <TouchableOpacity
          onPress={() => (compact ? onToggle(task.id) : setIsExpanded(!isExpanded))}
          style={styles.contentArea}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`${task.title}. ${task.description}`}
        >
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                isCompleted && styles.titleCompleted,
              ]}
              numberOfLines={compact && !isExpanded ? 2 : undefined}
            >
              {task.title}
            </Text>

            {task.priority && !isCompleted ? (
              <View style={styles.priorityPill}>
                <Icon name="sparkles" size={10} color={colors.primaryDark} style={{ marginRight: 2 }} />
                <Text style={styles.priorityText}>Top</Text>
              </View>
            ) : null}
          </View>

          {/* Description */}
          {(!compact || isExpanded) && (
            <Text style={[styles.description, isCompleted && styles.descCompleted]}>
              {task.description}
            </Text>
          )}

          {/* Metadata chips */}
          <View style={styles.metaRow}>
            {task.location ? (
              <View style={styles.locationPill}>
                <Icon name="map-pin" size={11} color={colors.textMuted} style={{ marginRight: 4 }} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {task.location}
                </Text>
              </View>
            ) : null}

            {task.hostelOnly ? (
              <View style={styles.hostelBadge}>
                <Text style={styles.hostelBadgeText}>Hostel</Text>
              </View>
            ) : null}

            {!compact && task.tips ? (
              <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                style={styles.tipToggleButton}
              >
                <Text style={styles.tipToggleText}>
                  {isExpanded ? 'Hide tip' : 'Quick tip'}
                </Text>
                <Icon
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={12}
                  color={colors.primary}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>

      {/* Expanded tip card */}
      {isExpanded && task.tips ? (
        <View style={styles.tipBox}>
          <Icon name="sparkles" size={14} color={colors.primaryDark} style={styles.tipIcon} />
          <Text style={styles.tipText}>
            <Text style={{ fontWeight: 'bold' }}>Senior Tip: </Text>
            {task.tips}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  compactCard: {
    padding: spacing.sm + 4,
  },
  completedCard: {
    backgroundColor: '#FAFAF8',
    borderColor: '#E8E8E4',
    opacity: 0.85,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    padding: 6,
    marginRight: 6,
    marginLeft: -4,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  contentArea: {
    flex: 1,
    paddingVertical: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    flex: 1,
    paddingRight: 6,
  },
  titleCompleted: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
  description: {
    fontSize: typography.fontSizes.sm,
    color: colors.textDark,
    opacity: 0.85,
    fontFamily: typography.fontFamily,
    lineHeight: 18,
    marginBottom: 8,
  },
  descCompleted: {
    color: colors.textMuted,
    opacity: 0.65,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    maxWidth: '70%',
  },
  locationText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  hostelBadge: {
    backgroundColor: colors.secondarySubtle,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  hostelBadgeText: {
    fontSize: typography.fontSizes.xs,
    color: colors.secondary,
    fontWeight: typography.fontWeights.medium,
    fontFamily: typography.fontFamily,
  },
  tipToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  tipToggleText: {
    fontSize: typography.fontSizes.xs,
    color: colors.primaryDark,
    fontWeight: typography.fontWeights.medium,
    fontFamily: typography.fontFamily,
    marginRight: 2,
  },
  tipBox: {
    marginTop: 10,
    backgroundColor: '#FFF9ED',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    borderRadius: borderRadius.sm,
    padding: spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  tipText: {
    fontSize: typography.fontSizes.xs,
    color: '#8A4B00',
    fontFamily: typography.fontFamily,
    flex: 1,
    lineHeight: 16,
  },
});
